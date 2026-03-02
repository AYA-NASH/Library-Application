import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useReaderAccess } from "../../Hooks/ReaderHooks/useReaderAccess";
import { useReaderSession } from "../../Hooks/ReaderHooks/useReaderSession";
import { useAuth } from "../../Auth/AuthContext";
import { ReaderBook } from "../../types/reader.types";
import { useEffect } from "react";
import ReaderContainer from "./components/ReaderContainer";

const ReaderPage = () => {
    console.log("Rendering ReaderPage");
    const { bookId } = useParams<{ bookId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { bookTitle?: string } | null;

    const { token } = useAuth();

    const accessState = useReaderAccess(bookId, token, "full");
    const isInternalReader =
        accessState.status === "success" ? accessState.data.source === "INTERNAL" : false;
    useReaderSession(bookId, isInternalReader);

    // Redirect to Google viewer when source is Google
    useEffect(() => {
        if (
            accessState.status === "success" &&
            accessState.data.source === "GOOGLE"
        ) {
            window.location.href = accessState.data.url;
        }
    }, [accessState]);

    const title = state?.bookTitle ?? "Book";

    if (!bookId) {
        return (
            <div className="container py-5 text-center">
                <h3 className="text-danger">Book not found</h3>
                <p>The requested book could not be found.</p>
                <button className="btn btn-outline-secondary mt-3" onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>
        );
    }

    if (accessState.status === "loading") {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-2 text-muted">Loading reader...</p>
            </div>
        );
    }

    if (accessState.status === "error") {
        return (
            <div className="container py-5 text-center">
                <h3 className="text-danger">Error</h3>
                <p>{accessState.message}</p>
                <button className="btn btn-outline-secondary mt-3" onClick={() => navigate(-1)}>
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
                <p className="mt-2 text-muted">Redirecting to reader...</p>
            </div>
        );
    }

    const book: ReaderBook = {
        id: bookId,
        title,
        fileUrl: accessState.data.url,
    };

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
                                        Reader
                                    </li>
                                </ol>
                            </nav>
                            <h1 className="h3 mb-0 text-truncate fw-bold text-dark">{title}</h1>
                        </div>
                        <button
                            className="btn btn-outline-dark btn-sm rounded-pill px-4 shadow-sm"
                            onClick={() => navigate(-1)}
                        >
                            Exit Reader
                        </button>
                    </div>

                    <div className="bg-white rounded-3 shadow-sm p-4 border border-light">
                        <ReaderContainer book={book} accessMode="FULL" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReaderPage;