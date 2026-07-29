import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableFilterConfig } from "@/constants/admin-dashboard/TableFilterConfig";
import { Table } from "@tanstack/react-table";
import { Search } from "lucide-react";

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
    return (
        <div className="flex items-center gap-3">
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

            {filters.map((filter) => (
                <Select
                    key={filter.id}
                    value={
                        (table
                            .getColumn(filter.id)
                            ?.getFilterValue() as string) ?? ""
                    }
                    onValueChange={(value) =>
                        table
                            .getColumn(filter.id)
                            ?.setFilterValue(
                                value === "all" ? undefined : value
                            )
                    }
                >
                    <SelectTrigger className="w-44">
                        <SelectValue placeholder={filter.title} />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="all">
                            All
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
            ))}
        </div>
    );
}