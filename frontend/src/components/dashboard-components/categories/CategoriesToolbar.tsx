import type { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryDetails } from "@/models/CategoryModel";
import { categorySortOptions } from "@/constants/admin-dashboard/CategoriesSortOptions";

interface CategoriesToolbarProps {
    table: Table<CategoryDetails>;
}
export function CategoriesToolbar({ table }: CategoriesToolbarProps) {
    const sorting = table.getState().sorting;

    const currentSortValue =
        sorting.length > 0
            ? `${sorting[0].id}-${sorting[0].desc ? "desc" : "asc"}`
            : "none";

    const selectedOption = categorySortOptions.find(
        (opt: any) => opt.value === currentSortValue
    ); 

    const handleSortChange = (value: string | null) => {
        if (!value || value === "none") {
            table.resetSorting();
            return;
        }

        const [id, dir] = value.split("-");
        table.setSorting([{ id, desc: dir === "desc" }]);
    };

    return (
        <div className="flex items-center justify-between gap-4 pb-4">
            <Input
                className="max-w-2xl"
                placeholder="Search categories ..."
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
            />

            <Select value={currentSortValue} onValueChange={handleSortChange}>
                <SelectTrigger className="w-md">
                    <SelectValue placeholder="Sort By ...">
                        {selectedOption ? selectedOption.label : "Default (No Sort)"}
                    </SelectValue>
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="none">Default (No Sort)</SelectItem>
                    {categorySortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}