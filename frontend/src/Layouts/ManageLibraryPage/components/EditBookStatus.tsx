import { useEffect, useState } from "react";
import { BookModel } from "../../../models/BookModel"
import { ConfirmAction } from "../../Utils/ConfirmAction";
import { useDeleteBook, useUpdateBookQuantity } from "../../../api/hooks/BookHooks/useAdminBooks";
import { toast } from "sonner";

export const EditBookStatus: React.FC<{ book: BookModel, deleteBook: () => void, updateBook: () => void }> = (props) => {
    const [quantity, setQuantity] = useState<number>(() => props.book.copies ?? 0);
    const [remaining, setRemaining] = useState<number>(() => props.book.copiesAvailable ?? 0);

    const { mutate: updateQty, isPending: isUpdating } = useUpdateBookQuantity();
    const { mutate: deleteMutation, isPending: isDeleting } = useDeleteBook();

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        setQuantity(props.book.copies ?? 0);
        setRemaining(props.book.copiesAvailable ?? 0);
    }, [props.book.copies, props.book.copiesAvailable]); // Specific dependencies are safer

    const isInternalChange = quantity !== props.book.copies;

    function internalIncrease() {
        setQuantity(prev => prev + 1);
        setRemaining(prev => prev + 1);
    }

    function internalDecrease() {
        if (quantity > 0 && remaining > 0) {
            setQuantity(prev => prev - 1);
            setRemaining(prev => prev - 1);
        }
    }

    async function updateQuantity() {
        updateQty({ bookId: props.book.id, quantity }, {
            onSuccess: () => {
                toast.success("Quantity updated!");
                props.updateBook();
            },
            onError: () => toast.error("Failed to update quantity")
        });
    }

    async function confirmDeleteBook() {
        deleteMutation(props.book.id, {
            onSuccess: () => {
                setShowDeleteConfirm(false);
                toast.success("Book deleted successfully");
                props.deleteBook();
            },
            onError: () => toast.error("Failed to delete book")
        });
    }

    return (
        <div className="d-flex flex-column align-items-center justify-content-center h-100 p-3">
            <div className="mb-4">
                {remaining > 0 ? (
                    <span className="badge rounded-pill px-3 py-2 bg-success-subtle text-success border border-success-subtle">
                        ● IN STOCK
                    </span>
                ) : (
                    <span className="badge rounded-pill px-3 py-2 bg-danger-subtle text-danger border border-danger-subtle">
                        ○ OUT OF STOCK
                    </span>
                )}
            </div>

            <div className="text-center mb-4">
                <div className="d-flex justify-content-between gap-4">
                    <div>
                        <p className="text-muted d-block">Total</p>
                        <span className="h5 fw-bold">{quantity}</span>
                    </div>
                    <div className="border-start ps-4">
                        <p className="text-muted d-block">Remaining</p>
                        <span className="h5 fw-bold">{remaining}</span>
                    </div>
                </div>
            </div>

            <div className="d-flex align-items-center mb-4 bg-light rounded-pill p-1 border">
                <button className="btn btn-sm rounded-circle border-0 shadow-none" onClick={internalDecrease}>
                    <span className="h4 m-0">−</span>
                </button>
                <input
                    type="text"
                    className="form-control form-control-sm text-center border-0 bg-transparent fw-bold"
                    style={{ pointerEvents: 'none', width: '60px' }}
                    value={quantity}
                    readOnly
                />
                <button className="btn btn-sm rounded-circle border-0 shadow-none" onClick={internalIncrease}>
                    <span className="h4 m-0">+</span>
                </button>
            </div>

            <div className="d-grid gap-2 w-100 px-4">
                <button
                    className={`btn shadow-sm btn-sm ${isInternalChange ? 'btn-primary' : 'btn-secondary disabled opacity-50'}`}
                    onClick={updateQuantity}
                    disabled={!isInternalChange || isUpdating}
                >
                    {isUpdating ? (
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                    ) : 'Update Quantity'}
                </button>

                <button
                    className="btn btn-outline-danger btn-sm border-0 mt-1"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isDeleting}
                >
                    Delete Book
                </button>
            </div>

            <ConfirmAction
                show={showDeleteConfirm}
                title="Delete Book"
                message="Are you sure you want to delete this book? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isProcessing={isDeleting}
                onCancel={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDeleteBook}
            />
        </div>
    );
}