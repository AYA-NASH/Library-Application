import { useEffect, useState } from "react";
import { BookModel } from "../../../models/BookModel"
import { useAuth } from "../../../Auth/AuthContext";
import { ConfirmAction } from "../../Utils/ConfirmAction";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const EditBookStatus : React.FC<{ book: BookModel, deleteBook: () => void, updateBook: () => void }> = (props) => {
    const {token} = useAuth();

    const [quantity, setQuantity] = useState<number>(0);
    const [remaining, setRemaining] = useState<number>(0);

    const isInternalChange = quantity !== props.book.copies;

    const [isUpdating, setIsUpdating] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchBookInState = () => {
            props.book.copies ? setQuantity(props.book.copies) : setQuantity(0);
            props.book.copiesAvailable
                ? setRemaining(props.book.copiesAvailable)
                : setRemaining(0);
        };

        fetchBookInState();
    }, []);
    
    function internalIncrease() {
        setQuantity(quantity + 1);
        setRemaining(remaining + 1);
    }

    function internalDecrease() {
        if (quantity > 0 && remaining > 0) {
            setQuantity(quantity - 1);
            setRemaining(remaining - 1);
        }
    }

    async function updateQuantity() {
        setIsUpdating(true);

        const url = `${baseUrl}/admin/secure/update/book/quantity?bookId=${props.book.id}&quantity=${quantity}`;
        const requestOptions = {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };

        const response = await fetch(url, requestOptions);
        
        if (!response.ok) {
            throw new Error("Something went wrong");
        }

        setDisplaySuccess(true);
        setTimeout(() => setDisplaySuccess(false), 3000);
        
        setIsUpdating(false);

        props.updateBook();
    }

    async function confirmDeleteBook() {
        try {
            setIsDeleting(true);

            const url = `${baseUrl}/admin/secure/delete/book?bookId=${props.book.id}`;
            const requestOptions = {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            };

            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                throw new Error("Failed to delete book");
            }

            setShowDeleteConfirm(false);
            props.deleteBook();
        } finally {
            setIsDeleting(false);
        }
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
                    style={{ pointerEvents: 'none' }} 
                    value={quantity} 
                    readOnly 
                />
                <button className="btn btn-sm rounded-circle border-0 shadow-none" onClick={internalIncrease}>
                    <span className="h4 m-0">+</span>
                </button>
            </div>

            <div className="d-grid gap-2 w-100 px-4">
                <button 
                    className={`btn shadow-sm btn-sm ${
                        displaySuccess ? 'btn-success' : (isInternalChange ? 'btn-primary' : 'btn-secondary disabled opacity-50')
                    }`}
                    onClick={updateQuantity}
                >
                   {isUpdating ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                        displaySuccess ? 'Updated!' : 'Update Quantity'
                    )}
                </button>

                <button 
                    className="btn btn-outline-danger btn-sm border-0 mt-1" 
                    onClick={() => setShowDeleteConfirm(true)}
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