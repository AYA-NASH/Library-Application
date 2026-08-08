import { Checkbox } from "@/components/ui/checkbox";
import { BookModel } from "@/models/BookModel";
import { ColumnDef } from "@tanstack/react-table";
import { BookCell, CategoryCell, categoryFilterFn, sourceFilterFn, statusFilterFn } from "./booksColumnsUtils";
import { Badge } from "@/components/ui/badge";

export const BookColumns: ColumnDef<BookModel>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox className="ml-4"
                checked={table.getIsAllPageRowsSelected()}
                indeterminate={table.getIsSomePageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            />
        ),
        cell: ({ row }) => (
            <Checkbox className="ml-4"
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "book",
        header: "Book",
        cell: ({ row }) => <BookCell {...row.original} />
    },
    {
        accessorKey: "categories",
        id: "categories",
        header: "Category",
        filterFn: categoryFilterFn,
        cell: ({ row }) => <CategoryCell categories={row.original.categories ?? []} />,
    },
    {
        accessorKey: "status",
        header: "Status",
        filterFn: statusFilterFn,
        cell: ({ row }) => {
            const copiesAvailable = row.original.copiesAvailable ?? 0;
            const isAvailable = copiesAvailable > 0;

            return (
                <Badge
                    variant={isAvailable ? "outline" : "destructive"}
                    className={isAvailable
                        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                        : ""}
                >
                    {isAvailable ? "Available" : "Out of Stock"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "availableCopies",
        header: "Available",
        cell: ({ row }) => <span className="ml-6">{row.original.copiesAvailable}</span>
    },
    {
        id: "borrowedCopies",
        header: "Borrowed",
        cell: ({ row }) => {
            const totalCopies = row.original.copies ?? 0;
            const availableCopies = row.original.copiesAvailable ?? 0;

            return <span className="ml-6">{totalCopies - availableCopies}</span>
        },
    },
    {
        accessorKey: "dataSource",
        header: "Book Source",
        filterFn: sourceFilterFn,
        cell: ({ row }) => {
            const source = row.original.dataSource;
            return <Badge variant={`${(source === "INTERNAL") ? "default" : "secondary"}`}>
                {source}
            </Badge>
        }
    }
]
