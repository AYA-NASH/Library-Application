import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Power, Trash2 } from "lucide-react";
import { CategoryDetails } from "@/models/CategoryModel";

export const categoriesColumns: ColumnDef<CategoryDetails>[] = [
    {
        accessorKey: "name",
        header: "Category",
        filterFn: "includesString",

    },
    {
        accessorKey: "booksCount",
        header: "Books Count",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const categoryName = row.original.name
            return (
                <div className="ml-4 flex shrink-0 items-center gap-1">
                    <Button variant="ghost" size="icon" aria-label={`View ${categoryName}`}>
                        <Eye className="size-4" />
                    </Button>

                    <Button variant="ghost" size="icon" aria-label={`Edit ${categoryName}`}>
                        <Pencil className="size-4" />
                    </Button>

                    <Button variant="ghost" size="icon" aria-label={`Toggle ${categoryName}`}>
                        <Power className="size-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${categoryName}`}
                    >
                        <Trash2 className="size-4 text-destructive" />
                    </Button>
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
];