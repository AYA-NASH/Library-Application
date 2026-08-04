import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import { BookForm } from "../form/BookForm";
import { useCategoriesReferences } from "@/api/hooks/BookHooks/useCategories";
import { useAddBook } from "@/api/hooks/BookHooks/useAdminBooks";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { BookOpen } from "lucide-react";

interface BookModalProps {
    trigger: React.ReactElement;
}

export function BookFormModal({
    trigger
}: BookModalProps) {
    const [open, setOpen] = useState(false);

    const { data: categories, isLoading: isCategoriesLoading } = useCategoriesReferences();

    const { mutate, isPending } = useAddBook();

    const isAdmin = useAuthStore((s) => s.isAdmin);


    const handleSubmit = async (formData: FormData) => {
        if (!isAdmin()) {
            toast.error("Unauthorized: Admin access required");
            return;
        }
        mutate(formData, {
            onSuccess: () => {
                toast.success("Book Added Successfully");
                setOpen(false);
            },
            onError: (err: any) => {
                const errorMessage = err.response?.data?.message || err.message || "Failed to Add Book";
                toast.error(errorMessage);
            }
        }
        );
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={trigger} />

            <DialogContent className="max-w-6xl! w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        <BookOpen className="h-6 w-6 bg-primary/10 text-primary inline m-2" />
                        Add New Book
                    </DialogTitle>
                    <DialogDescription className="ml-2">
                        Fill in the information below to add a new book to the library system.
                    </DialogDescription>
                </DialogHeader>

                <BookForm
                    isEdit={false}
                    categories={categories || []}
                    isCategoriesLoading={isCategoriesLoading}
                    onSubmit={handleSubmit}
                    onCancel={() => setOpen(false)}
                    isSubmitting={isPending}
                />
            </DialogContent>

        </Dialog>
    );
}