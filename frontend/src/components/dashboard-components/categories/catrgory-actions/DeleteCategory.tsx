import { useDeleteCategory, useGetBookCountByCategory } from "@/api/hooks/BookHooks/useCategories";
import { ConfirmAction } from "@/components/ConfirmAction";
import { parseApiError } from "@/errors/parseApiError";
import { CategoryDetails } from "@/models/CategoryModel";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteCategoryProps {
    categoryToDelete: CategoryDetails
    trigger: React.ReactElement
}

export function DeleteCategory({
    categoryToDelete,
    trigger
}: DeleteCategoryProps) {
    const [open, setOpen] = useState(false);

    const deleteCategoryMutation = useDeleteCategory();

    const { data: booksCount, isLoading: isCountingBooks } = useGetBookCountByCategory(
        categoryToDelete.id ?? 0,
        open
    );

    const confirmDeleteCategory = () => {
        deleteCategoryMutation.mutate(categoryToDelete.id, {
            onSuccess: () => {
                toast.success("Category deleted");
                setOpen(false);
            },
            onError: (err: any) => {
                const apiError = parseApiError(err);
                toast.error(apiError.message);
            }
        });
    };

    const renderDescription = () => {
        if (isCountingBooks || booksCount === undefined) {
            return "Calculating associated books...";
        }

        if (booksCount > 0) {
            return (
                <>
                    This category currently has <strong className="font-semibold text-foreground">{booksCount}</strong> associated {booksCount === 1 ? "book" : "books"}. Deleting it will permanently remove the category.
                </>
            );
        }
        return `Are you sure you want to delete "${categoryToDelete.name}" Category? This action cannot be undone.`;
    };
    return (
        <ConfirmAction
            open={open}
            onOpenChange={setOpen}
            title={`Delete "${categoryToDelete.name}"?`}
            confirmText="Delete Book"
            description={renderDescription()}
            trigger={trigger}
            disabled={isCountingBooks || booksCount === undefined}
            isProcessing={deleteCategoryMutation.isPending}
            onConfirm={confirmDeleteCategory}
        />
    )
}
