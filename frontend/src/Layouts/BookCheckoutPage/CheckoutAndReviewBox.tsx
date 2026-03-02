import { FC, useState } from "react";
import { BookModel } from "../../models/BookModel";
import { Link, useNavigate } from "react-router-dom";
import { LeaveAReview } from "../Utils/LeaveAReview";

export const CheckoutAndReviewBox: FC<{
    book: BookModel | undefined;
    mobile: boolean;
    isAuthenticated: boolean;
    isCheckedout: boolean;
    isDigitalUnlocked: boolean;
    currentLoansCount: number;
    checkoutBook: any;
    isReviewLeft: boolean;
    submitReview: any;
}> = (props) => {

    const [showDigital, setShowDigital] = useState(false);

    const navigate = useNavigate();

    const renderCheckoutButton = () => {
        if (!props.isAuthenticated) {
            return (
                <Link to="/login" className="btn btn-dark btn-lg w-100 rounded-3 fw-semibold">
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign in to Borrow
                </Link>
            );
        }

        if (props.isCheckedout) {
            return (
                <div className="alert alert-success mt-3 mb-0">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    You’ve already borrowed this book.
                </div>
            );
        }

        if (props.currentLoansCount >= 5) {
            return (
                <div className="alert alert-danger mt-3 mb-0">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    Loan limit reached (5 books).
                </div>
            );
        }

        return (
            <button
                onClick={props.checkoutBook}
                className="btn btn-dark btn-lg w-100 rounded-3 fw-semibold mt-3"
            >
                <i className="bi bi-book me-2"></i>
                Borrow Hardcopy
            </button>
        );
    };

    const renderDigitalAction = () => {
        if (!props.isAuthenticated) {
            return (
                <Link to="/login" className="btn btn-outline-dark btn-lg w-100 rounded-3">
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign in to Buy
                </Link>
            );
        }

        if (props.isDigitalUnlocked) {
            return (
                <button className="btn btn-dark btn-lg w-100 rounded-3"
                    onClick={handleAccessBook}
                >
                    <i className="bi bi-journal-bookmark-fill me-2"></i>
                    Read Full Book
                </button>
            );
        }

        return (
            <button className="btn btn-dark btn-lg w-100 rounded-3">
                <i className="bi bi-unlock-fill me-2"></i>
                Unlock Digital — $14.99
            </button>
        );
    };

    const handlePreview = () => {
        navigate(`/reader/${props.book?.id}/preview`, {
            state: { bookTitle: props.book?.title },
        });
    };

    const handleAccessBook = () => {
        navigate(`/reader/${props.book?.id}`, {
            state: { bookTitle: props.book?.title },
        });
    };

    return (
        <div
            className={
                props.mobile
                    ? "card shadow-sm border-0 mt-4 p-4 rounded-4"
                    : "card shadow-sm border-0 col-3 p-4 rounded-4"
            }
        >

            <button className="btn btn-outline-secondary btn-lg w-100 rounded-3 fw-semibold"
                onClick={handlePreview}
            >
                <i className="bi bi-eye me-2"></i>
                Read Preview
            </button>
            <p className="text-muted text-center mt-2">
                Free sample — first 10 pages
            </p>

            <hr />

            <h5 className="fw-bold mb-3">
                <i className="bi bi-cart3 me-2"></i>
                Borrow or Buy
            </h5>

            {/* Physical Section */}
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-semibold">
                        <i className="bi bi-book-half me-2"></i>
                        Physical Copy
                    </span>
                    <span className="text-muted">
                        {props.currentLoansCount}/5 loans
                    </span>
                </div>

                {props.book?.copiesAvailable && props.book.copiesAvailable > 0 ? (
                    <div className="text-success fw-semibold">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Available now
                    </div>
                ) : (
                    <div className="text-danger fw-semibold">
                        <i className="bi bi-hourglass-split me-2"></i>
                        Join wait list
                    </div>
                )}

                <p className="mt-2 mb-1">
                    <strong>{props.book?.copiesAvailable}</strong> available of{" "}
                    <strong>{props.book?.copies}</strong> copies
                </p>

                {renderCheckoutButton()}

                <p className="text-muted mt-2 small">
                    Availability may change until checkout is completed.
                </p>
            </div>

            <hr />

            {/* Digital Header (Clickable & Styled) */}
            <div
                className="d-flex justify-content-between align-items-center py-2 px-2 rounded-3 digital-toggle"
                style={{
                    cursor: "pointer",
                    backgroundColor: showDigital ? "#f8f9fa" : "transparent",
                    transition: "all 0.2s ease"
                }}
                onClick={() => setShowDigital(!showDigital)}
            >
                <span className="fw-semibold">
                    <i className="bi bi-tablet me-2"></i>
                    Digital Version
                </span>
                <span>
                    <i
                        className={`bi ${showDigital
                            ? "bi-chevron-up"
                            : "bi-chevron-down"
                            }`}
                    ></i>
                </span>
            </div>

            {showDigital && (
                <div className="mt-3">
                    <p className="text-muted">
                        <i className="bi bi-lightning-charge-fill text-warning me-2"></i>
                        Instant access — start reading immediately.
                    </p>

                    <p className="text-muted">
                        <i className="bi bi-cloud-check me-2"></i>
                        Permanent access across all devices.
                    </p>

                    <p className="text-muted">
                        <i className="bi bi-search me-2"></i>
                        Searchable text & adjustable font size.
                    </p>

                    {renderDigitalAction()}
                </div>
            )}

            <hr />

            {/* Reviews */}
            <div className="mt-3">
                {props.isAuthenticated && !props.isReviewLeft && (
                    <LeaveAReview submitReview={props.submitReview} />
                )}

                {props.isAuthenticated && props.isReviewLeft && (
                    <div className="alert alert-success">
                        <i className="bi bi-star-fill me-2"></i>
                        Thank you for your review!
                    </div>
                )}

                {!props.isAuthenticated && (
                    <div className="text-muted text-center">
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign in to leave a review.
                    </div>
                )}
            </div>
        </div>
    );
};