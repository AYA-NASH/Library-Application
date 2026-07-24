import type { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryDetails } from "@/models/CategoryModel";

interface CategoriesToolbarProps {
    table: Table<CategoryDetails>;
}
export function CategoriesToolbar({ table }: CategoriesToolbarProps) {
    return (
        <div className="flex items-center justify-between gap-4 pb-4">
            <Input
                className="max-w-2xl"
                placeholder="Search categories ..."
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
            />

            <Select
                onValueChange={(value) => {
                    switch (value) {
                        case "name":
                            table.setSorting([{ id: "name", desc: false }]);
                            break;
                        case "booksCount":
                            table.setSorting([{ id: "booksCount", desc: false }]);
                            break;
                        default:
                            table.resetSorting();
                    }
                }}
            >
                <SelectTrigger className="w-md">
                    <SelectValue placeholder="Srot By ..." />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="name">
                        Name (A-Z)
                    </SelectItem>

                    <SelectItem value="booksCount">
                        Books Count
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}