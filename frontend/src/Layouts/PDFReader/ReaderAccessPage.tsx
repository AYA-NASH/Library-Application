import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useReadingProgress } from "../../api/hooks/ReaderHooks/useReadingProgress";
import { useBookAccess } from "../../api/hooks/ReaderHooks/useBookAccess";
import { useReaderSession } from "../../api/hooks/ReaderHooks/useReaderSession";
import { useEffect } from "react";
import { SpinnerLoading } from "../Utils/SpinnerLoading";

import { ApiErrorDisplay } from "../Utils/ApiErrorDisplay";

export const ReaderAccessPage = () => {
    const { bookId } = useParams<{ bookId: string }>();
    const navigate = useNavigate();
    const { state } = useLocation() as { state: { bookTitle?: string } };

    const { data: access, isLoading: loadingAccess, error, refetch } = useBookAccess(Number(bookId), "full");
    const { lastPage, isLoading: loadingProgress } = useReadingProgress(Number(bookId));
    const { isBookOpenElsewhere } = useReaderSession(bookId, false);

    useEffect(() => {
        if (access?.source !== "INTERNAL" && access?.url) {
            window.location.href = access.url;
        }
    }, [access]);

    if (loadingAccess || loadingProgress) return <SpinnerLoading message="Checking access..." />;
    if (error || !access) return <ApiErrorDisplay error={error} title="Access verification failed" onRetry={() => refetch()} />;

    if (access.source !== "INTERNAL") return <SpinnerLoading message="Redirecting to external reader..." />;

    const title = state?.bookTitle ?? "Book";
    const statusText = isBookOpenElsewhere ? "Reading Now" : lastPage > 1 ? "In Progress" : "Not Started";

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

                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body p-4">
                            <h2 className="h4 card-title fw-bold mb-3">{title}</h2>

                            <div className="d-flex justify-content-center gap-2 mb-4">
                                <span className={`badge ${isBookOpenElsewhere ? 'bg-info' : 'bg-secondary'}`}>{statusText}</span>
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
                                className={`btn w-100 py-3 fw-bold ${lastPage > 1 ? "btn-info text-white" : "btn-primary"}`}
                                onClick={() => navigate("read", { state })}
                            >
                                {lastPage > 1 ? "Resume Reading" : "Start Reading"}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )


};