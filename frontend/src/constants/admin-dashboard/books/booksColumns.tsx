import { Checkbox } from "@/components/ui/checkbox";
import { BookModel } from "@/models/BookModel";
import { ColumnDef } from "@tanstack/react-table";
import { BookCell, CategoryCell } from "./booksColumnsUtils";

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
        cell: ({ row }) => <BookCell {...row.original}/>
    },
    {
        accessorKey: "categories",
        id: "categories",
        header: "Category",
        filterFn: (row, columnId, filterValue: string[]) => {
            if (!filterValue || filterValue.length === 0) return true

            const categories = row.getValue(columnId) as Array<{ id: string; name: string }> | undefined
            if (!categories || categories.length === 0) return false

            return filterValue.some((val) =>
                categories.some((cat) => cat.id === val || cat.name === val)
            )
        },
        cell: ({ row }) => <CategoryCell categories={row.original.categories ?? []} />,
    },
    
    {
        accessorKey: "copiesAvailable",
        header: "Copies Available"
    },
    {
        accessorKey: "borrowedCopies",
        header: "Borrowed",
        cell: ({ row }) => {
            const book = row.original;
            return (book.copies && book.copiesAvailable) ? (book.copies - book.copiesAvailable) : "-";
        }
    },
    {
        accessorKey: "copies",
        header: "Total Copies"
    },
]
