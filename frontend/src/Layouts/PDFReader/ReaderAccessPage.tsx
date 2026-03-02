import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import { useReaderAccess } from "../../Hooks/ReaderHooks/useReaderAccess";
import { useReadingProgress } from "../../Hooks/ReaderHooks/useReadingProgress";
import { useEffect, useState } from "react";
import { getIsBookOpen } from "../../Hooks/ReaderHooks/useReaderSession";

const ReaderAccessPage = () => {
    console.log("Rendering ReaderAccessPage");
    const { bookId } = useParams<{ bookId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { bookTitle?: string } | null;

    const { token } = useAuth();

    const accessState = useReaderAccess(bookId, token, "full");
    const { lastPage } = useReadingProgress(bookId ?? "");
    const [isReading, setIsReading] = useState(() =>
        bookId ? getIsBookOpen(bookId) : false
    );

    // Listen for session changes (another tab opened/closed)
    useEffect(() => {
        if (!bookId) return;
        const check = () => setIsReading(getIsBookOpen(bookId));
        window.addEventListener("storage", check);
        return () => window.removeEventListener("storage", check);
    }, [bookId]);

    // Redirect to Google viewer when source is Google
    useEffect(() => {
        if (accessState.status === "success" && accessState.data.source === "GOOGLE") {
            window.location.href = accessState.data.url;
        }
    }, [accessState]);

    const title = state?.bookTitle ?? "Book";
    const handleOpenReader = () => navigate("read");

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
                <p className="mt-2 text-muted">Loading...</p>
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

    // Google: redirect happens in useEffect; show loading meanwhile
    if (accessState.data.source === "GOOGLE") {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-2 text-muted">Redirecting to reader...</p>
            </div>
        );
    }

    const statusText = isReading ? "Reading Now" : lastPage > 1 ? "In Progress" : "Not Started";

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <button
                        className="btn btn-link text-decoration-none text-muted mb-3 p-0"
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </button>

                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <h2 className="h4 card-title fw-bold mb-3">{title}</h2>

                            <div className="d-flex flex-wrap gap-2 mb-3">
                                <span className="badge bg-secondary">{statusText}</span>
                                {lastPage > 1 && (
                                    <span className="badge bg-primary">Page {lastPage}</span>
                                )}
                            </div>

                            <p className="text-muted small mb-4">
                                {lastPage > 1
                                    ? "Continue from where you left off."
                                    : "Start reading this book."}
                            </p>

                            <button
                                className={`btn w-100 py-3 fw-bold ${isReading ? "btn-info text-white" : "btn-primary"}`}
                                onClick={handleOpenReader}
                            >
                                {isReading ? "Resume Reading" : "Open Book"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReaderAccessPage;