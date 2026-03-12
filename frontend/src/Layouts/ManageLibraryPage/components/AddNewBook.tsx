import { useState } from "react";
import { useAuth } from "../../../Auth/AuthContext";
import { BookForm } from "./BookForm";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const AddNewBook = () => {
    const { user, token } = useAuth();
    const [displaySuccess, setDisplaySuccess] = useState(false);
    const [httpError, setHttpError] = useState("");
    const [resetKey, setResetKey] = useState(0); 

    const handleAddBook = async (formData: FormData) => {
        if (!user) return;
        setHttpError("");
        
        try {
            const url = `${baseUrl}/admin/secure/add/book`;
            const response = await fetch(url, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) {
                setHttpError("Failed to add book");
                return;
            }

            setDisplaySuccess(true);
            setResetKey((prev) => prev + 1);
            window.scrollTo(0, 0);
            setTimeout(() => setDisplaySuccess(false), 5000);
        } catch (err) {
            setHttpError(err instanceof Error ? err.message : "Failed to add book");
        }
    };

    return (
        <div className="container mt-5 mb-3">
            {displaySuccess && <div className="alert alert-success">Book added successfully!</div>}
            {httpError && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {httpError}
                    <button type="button" className="btn-close" onClick={() => setHttpError("")} aria-label="Close" />
                </div>
            )}
            <div className="card shadow-sm">
                <div className="card-body">
                    <BookForm key={resetKey} isEdit={false} onSubmit={handleAddBook} />
                </div>
            </div>
        </div>
    );
};