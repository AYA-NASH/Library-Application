import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useReaderAccess } from "../../Hooks/ReaderHooks/useReaderAccess";
import { useEffect } from "react";
import { ReaderBook } from "../../types/reader.types";
import ReaderContainer from "./components/ReaderContainer";
import { useAuth } from "../../Auth/AuthContext";

const ReaderPreviewPage = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const {token} = useAuth();
    const state = location.state as { bookTitle?: string } | null;

    const accessState = useReaderAccess(bookId, token, "preview");

    // Redirect to External viewer (i.e. Google) when source is Google
    useEffect(() => {
        if (
            accessState.status === "success" &&
            accessState.data.source === "GOOGLE"
        ) {
            window.location.href = accessState.data.url;
        }
    }, [accessState]);

    if (!bookId) {
        return (
            <div className="container py-5 text-center">
                <p className="text-muted">Invalid book.</p>
                <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>
        );
    }

    if (accessState.status === "loading") {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-2 text-muted">Loading preview...</p>
            </div>
        );
    }

    if (accessState.status === "error") {
        return (
            <div className="container py-5 text-center">
                <p className="text-danger">{accessState.message}</p>
                <button className="btn btn-outline-secondary mt-2" onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>
        );
    }

    if (accessState.status !== "success") return null;

    if (accessState.data.source === "GOOGLE") {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-2 text-muted">Redirecting to preview...</p>
            </div>
        );
    }

    const title = state?.bookTitle ?? "Book";

    const book: ReaderBook = {
        id: bookId,
        title,
        fileUrl: accessState.data.url,
    };

    console.log("Book INFO", book);
    return (
        <div className="container-fluid py-4 min-vh-100 bg-light font-sans">
            <div className="row justify-content-center">
                <div className="col-12 col-xl-10">
                    <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                        <div>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-1">
                                    <li className="breadcrumb-item small">
                                        <button
                                            className="text-decoration-none text-muted bg-transparent border-0 p-0"
                                            onClick={() => navigate(-1)}
                                        >
                                            Back
                                        </button>
                                    </li>
                                    <li className="breadcrumb-item active small" aria-current="page">
                                        Preview
                                    </li>
                                </ol>
                            </nav>
                            <h1 className="h3 mb-0 text-truncate fw-bold text-dark">{title}</h1>
                        </div>
                        <button
                            className="btn btn-outline-dark btn-sm rounded-pill px-4 shadow-sm"
                            onClick={() => navigate(-1)}
                        >
                            Close Preview
                        </button>
                    </div>

                    <div className="bg-white rounded-3 shadow-sm p-4 border border-light">
                        <ReaderContainer book={book} accessMode="PREVIEW" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReaderPreviewPage;