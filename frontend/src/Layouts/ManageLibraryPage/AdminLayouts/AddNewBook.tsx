import { useState } from "react";
import { BookForm } from "../components/BookForm";
import { useAuthStore } from "../../../store/useAuthStore";
import { useAddBook } from "../../../api/hooks/BookHooks/useAdminBooks";
import { toast } from "sonner";

export const AddNewBook = () => {
    const isAdmin = useAuthStore((s) => s.isAdmin);
    const [resetKey, setResetKey] = useState(0);

    const { mutate, isPending } = useAddBook();

    const handleAddBook = async (formData: FormData) => {
        if (!isAdmin()) {
            toast.error("Unauthorized: Admin access required");
            return;
        }


        mutate(formData, {
            onSuccess: () => {
                toast.success("Book Added Successfully");
                setResetKey(prev => prev + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            onError: (err: any) => {
                const errorMessage = err.response?.data?.message || err.message || "Failed to Add Book";
                toast.error(errorMessage);
            }
        }
        );

    };

    return (
        <div className="container mt-5 mb-3">
            <div className="card shadow-sm">
                <div className="card-body">
                    <BookForm key={resetKey} isEdit={false} onSubmit={handleAddBook} />
                </div>

                {isPending && (
                    <div className="position-absolute top-50 start-50 translate-middle">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Uploading...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};