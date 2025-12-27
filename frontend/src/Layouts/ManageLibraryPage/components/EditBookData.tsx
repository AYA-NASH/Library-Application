import { BookModel } from "../../../models/BookModel";
import defaultBookImg from '../../../Images/BooksImages/book_cover_default_dark.png';
import { BookForm } from "./BookForm";
import { useAuth } from "../../../Auth/AuthContext";
import { useState } from "react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const EditBookData: React.FC<{ book: BookModel, updateBook: () => void }> = (props) => {
    const { token } = useAuth();
    const [showModal, setShowModal] = useState(false);

    const handleUpdateDetails = async (formData: FormData) => {
        try {
            const url = `${baseUrl}/admin/secure/update/book/data/${props.book.id}`;

            const response = await fetch(url, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (!response.ok) throw new Error("Update failed");

            setShowModal(false);
            props.updateBook();
        } catch (error) {
            alert("Error updating book details");
        }
    };

    return (
        <div className="p-3 position-relative">

            <button className=
                "btn btn-light btn-sm position-absolute top-0 end-0 m-2 rounded-circle shadow-sm border"
                onClick={() => setShowModal(true)}
                title="Edit Book Details">
                <span style={{ color: '#6c757d' }}>✎</span>
            </button>

            <div className="row g-0">

                <div className="col-md-3">
                    <img
                        src={props.book.img ? props.book.img : defaultBookImg}
                        width="123"
                        height="196"
                        alt="book"
                        className="rounded shadow-sm"
                    />
                </div>

                <div className="col-md-9 d-flex flex-column justify-content-center">
                    <p className="text-primary mb-1 fw-bold">{props.book.author}</p>
                    <h3 className="card-title mb-2">{props.book.title}</h3>

                    <div className="mt-2">

                        <p className="rounded-pill bg-info text-dark px-3 py-1 d-inline-block" >
                            Category: {props.book.category}
                        </p>
                    </div>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-12">
                    <p className="card-text text-secondary" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                        {props.book.description}
                    </p>
                </div>
            </div>

            {showModal && (
                <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content shadow-lg border-0">
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title">Edit Book Details</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>

                            <div className="modal-body p-4">
                                <BookForm
                                    isEdit={true}
                                    initialData={props.book}
                                    onSubmit={handleUpdateDetails}
                                />
                            </div>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

