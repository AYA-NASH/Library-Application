import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableFilterConfig } from "@/constants/admin-dashboard/TableFilterConfig";
import { Table } from "@tanstack/react-table";
import { RotateCcw, Search } from "lucide-react";

interface Props<TData> {
    table: Table<TData>;
    searchPlaceholder?: string;
    filters?: TableFilterConfig[];
}

export function DataTableToolbar<TData>({
    table,
    searchPlaceholder = "Search...",
    filters = [],
}: Props<TData>) {
    const isFiltered =
        table.getState().columnFilters.length > 0 ||
        Boolean((table.getState().globalFilter as string)?.trim());

    const handleResetFilters = () => {
        table.resetColumnFilters();
        table.setGlobalFilter("");
    };

    return (
        <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    className="pl-9"
                    placeholder={searchPlaceholder}
                    value={(table.getState().globalFilter as string) ?? ""}
                    onChange={(e) =>
                        table.setGlobalFilter(e.target.value)
                    }
                />
            </div>

            {filters.map((filter) => {
                const currentValue = (table.getColumn(filter.id)?.getFilterValue() as string) ?? "all";
                const selectedOption = filter.options.find((opt) => opt.value === currentValue);

                return (
                    <Select
                        key={filter.id}
                        value={currentValue}
                        onValueChange={(value) =>
                            table
                                .getColumn(filter.id)
                                ?.setFilterValue(
                                    !value || value === "all" ? undefined : value
                                )
                        }
                    >
                        <SelectTrigger className="w-44">
                            <SelectValue placeholder={filter.title}>
                                {selectedOption ? selectedOption.label : filter.title}
                            </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">
                                All {filter.title}
                            </SelectItem>

                            {filter.options.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            })}

            {isFiltered && (
                <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResetFilters}
                    className="h-9 px-2.5 lg:px-3 text-muted-foreground hover:text-foreground"
                >
                    <RotateCcw className="mr-1.5 h-4 w-4" />
                    Reset
                </Button>
            )}
        </div>
    );
}