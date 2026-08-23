import { AdminMessageView } from "@/models/MessageModel";
import { ColumnDef } from "@tanstack/react-table";

export const messagesColumns: ColumnDef<AdminMessageView>[] = [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "userEmail",
        header: "Email",
    },
    {
        accessorKey: "createdAt",
        header: "Created",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
];