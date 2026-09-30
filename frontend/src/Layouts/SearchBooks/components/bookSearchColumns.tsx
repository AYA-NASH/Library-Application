import { BookModel } from "@/models/BookModel";
import { ColumnDef } from "@tanstack/react-table";

export const bookSearchColumns: ColumnDef<BookModel>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "img",
        header: "Image",
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "author",
        header: "Author",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        id: "categoryId",
        accessorFn: (row) => row.categories?.map(c => c.name).join(", ") ?? "-",
        header: "Category",
    }
];