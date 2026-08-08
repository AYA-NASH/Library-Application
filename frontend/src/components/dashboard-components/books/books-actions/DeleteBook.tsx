import { useDeleteBook } from "@/api/hooks/BookHooks/useAdminBooks";
import { ConfirmAction } from "@/components/ConfirmAction";
import { parseApiError } from "@/errors/parseApiError";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteBookProps {
    bookName: string;
    bookId: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DeleteBook({
    bookName,
    bookId,
    open,
    onOpenChange
}: DeleteBookProps) {
    const deleteBookMutation = useDeleteBook();

    const confirmDelete = () => {
        if (bookId === null) return

        deleteBookMutation.mutate(bookId, {
            onSuccess: () => {
                toast.success("Book deleted");
                onOpenChange(false);
            },
            onError: (err: any) => {
                const apiError = parseApiError(err);
                toast.error(apiError.message);
            }
        })
    }
    return (
        <ConfirmAction
            open={open}
            onOpenChange={onOpenChange}
            title={`Delete "${bookName}"?`}
            confirmText="Delete Category"
            description="Are you sure?"
            trigger={undefined}
            isProcessing={deleteBookMutation.isPending}
            onConfirm={confirmDelete}
        />
    )
}