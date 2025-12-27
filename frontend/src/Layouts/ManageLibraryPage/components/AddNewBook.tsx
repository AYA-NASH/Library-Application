import { useState } from "react";
import { useAuth } from "../../../Auth/AuthContext";
import { BookForm } from "./BookForm";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const AddNewBook = () => {
    const { user, token } = useAuth();
    const [displaySuccess, setDisplaySuccess] = useState(false);
    const [resetKey, setResetKey] = useState(0); 

    const handleAddBook = async (formData: FormData) => {
        if (!user) return;
        try {
            const url = `${baseUrl}/admin/secure/add/book`;
            const response = await fetch(url, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) throw new Error("Something went wrong");

            setDisplaySuccess(true);
            setResetKey((prev) => prev + 1); 
            window.scrollTo(0, 0);
            setTimeout(() => setDisplaySuccess(false), 5000);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container mt-5 mb-3">
            {displaySuccess && <div className="alert alert-success">Book added successfully!</div>}
            <div className="card shadow-sm">
                <div className="card-body">
                    <BookForm key={resetKey} isEdit={false} onSubmit={handleAddBook} />
                </div>
            </div>
        </div>
    );
};