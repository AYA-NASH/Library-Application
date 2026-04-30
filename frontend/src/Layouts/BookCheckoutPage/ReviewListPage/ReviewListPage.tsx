import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { Review } from "../../Utils/Review";
import { useReviews } from "../../../api/hooks/BookHooks/useReviews";

import { ApiErrorDisplay } from "../../Utils/ApiErrorDisplay";

export const ReviewListPage = () => {
    const { bookId } = useParams<{ bookId: string }>();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);

    const { data: reviewsPage, isLoading, isError, error, refetch } = useReviews(
        bookId || "",
        currentPage,
        reviewsPerPage
    );

    if (isLoading) return <SpinnerLoading />;

    if (isError || !reviewsPage) {
        return <ApiErrorDisplay error={error} title="Failed to load reviews" onRetry={() => refetch()} />;
    }

    const { totalElements, totalPages, content } = reviewsPage;
    const firstItem = (currentPage - 1) * reviewsPerPage + 1;
    const lastItem = Math.min(currentPage * reviewsPerPage, totalElements);

    return (
        <div className="container mt-5 mb-5" style={{ maxWidth: '900px' }}>
            {/* Header Section */}
            <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                <div>
                    <h2 className="fw-bold mb-1">User Reviews</h2>
                    <p className="text-muted mb-0">
                        Showing <span className="fw-semibold text-dark">{firstItem}-{lastItem}</span> of {totalElements} testimonials
                    </p>
                </div>
                <button
                    className="btn btn-outline-secondary btn-sm rounded-pill px-4"
                    onClick={() => navigate(-1)}
                >
                    Back to Book
                </button>
            </div>

            {/* Reviews Container */}
            <div className="row g-4">
                {content.length > 0 ? (
                    content.map((review) => (
                        <div className="col-12" key={review.id}>
                            <div className="card border-0 shadow-sm hover-shadow transition-all">
                                <div className="card-body p-4">
                                    <Review review={review} />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-5">
                        <i className="bi bi-chat-left-dots display-1 text-light"></i>
                        <p className="mt-3 text-muted">No reviews found for this book yet.</p>
                    </div>
                )}
            </div>

            {/* Modernized Pagination Wrapper */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-5">
                    <nav className="shadow-sm rounded">
                        <Pagination
                            currentPage={currentPage}
                            paginate={(page) => {
                                setCurrentPage(page);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            totalPages={totalPages}
                        />
                    </nav>
                </div>
            )}
        </div>
    );
};