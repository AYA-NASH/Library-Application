import { useFetchEditInfo, useUpdateBook } from "@/api/hooks/BookHooks/useAdminBooks";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AdminBookRequest } from "@/models/Admin";
import { BookModel } from "@/models/BookModel";
import { useMemo } from "react";
import { toast } from "sonner";
import { BookForm } from "../form/BookForm";
import { useCategoriesReferences } from "@/api/hooks/BookHooks/useCategories";
import { BookOpen } from "lucide-react";

interface EditBookModalProps {
    book: BookModel;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
export function EditBookModal({
    book,
    open,
    onOpenChange
}: EditBookModalProps) {

    const {
        data: editInfo,
    } = useFetchEditInfo(book.id);

    const { mutate: updateMutation, isPending } = useUpdateBook();
    const { data: categories, isLoading: isCategoriesLoading } = useCategoriesReferences();

    const editInitialData: AdminBookRequest | null = useMemo(() => {
        const categories = book.categories?.map((cat) => cat.id);
        const baseInitial: AdminBookRequest = {
            id: book.id,
            title: book.title,
            author: book.author ?? "",
            description: book.description ?? "",
            copies: book.copies ?? 0,
            categoryIds: categories ?? [],
            dataSource: book.dataSource,
            imageUrl: book.img,
        };

        if (editInfo) {
            return {
                ...baseInitial,
                hasPdf: editInfo.hasPdf,
                hasImage: editInfo.hasImage,
                imageUrl: editInfo.imageUrl ?? book.img,
                pdfFilename: editInfo.pdfFilename,
                imageFilename: editInfo.imageFilename,
            };
        }
        return baseInitial;
    }, [book, editInfo]);

    const handleUpdateDetails = async (formData: FormData) => {
        updateMutation(
            { bookId: book.id, formData },
            {
                onSuccess: () => {
                    onOpenChange(false);
                    toast.success("Book updated successfully");
                },
                onError: () => {
                    toast.error("Error updating book");
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl! w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        <BookOpen className="h-6 w-6 bg-primary/10 text-primary inline m-2" />
                        Edit Book
                    </DialogTitle>
                    <DialogDescription className="ml-2">
                        you can update book fields below
                    </DialogDescription>
                </DialogHeader>
                <BookForm
                    isEdit={true}
                    categories={categories || []}
                    isCategoriesLoading={isCategoriesLoading}
                    onSubmit={handleUpdateDetails}
                    onCancel={() => onOpenChange(false)}
                    isSubmitting={isPending}
                    initialData={editInitialData}
                />

            </DialogContent>
        </Dialog>
    )
}