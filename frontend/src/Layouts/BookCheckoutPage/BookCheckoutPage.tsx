import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { LatestReviews } from "./LatestReviews";
import defaultBookImg from '../../Images/BooksImages/book-luv2code-1000.png';
import { useAuthStore } from "../../store/useAuthStore";
import { useBookDetails } from "../../api/hooks/BookHooks/useBooks";
import { useIsBookReviewedByUser, useReviews, useSubmitReview } from "../../api/hooks/BookHooks/useReviews";
import { useCheckout, useCurrentLoansCount, useIsBookCheckedout } from "../../api/hooks/BookHooks/useLoans";

export const BookCheckoutPage = () => {

    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const { bookId } = useParams<{ bookId: string }>();

    const { data: book, isLoading: isLoadingBook, isError: isBookError } = useBookDetails(bookId || "");    // Review Sates:
    const { data: reviewsPage, isLoading: isLoadingReview } = useReviews(bookId || "", 0, 3);
    const { data: isReviewLeft, isLoading: isLoadingUserReview } = useIsBookReviewedByUser(bookId || "");
    const { data: isBookCheckedout, isLoading: isLoadingCheckedout } = useIsBookCheckedout(bookId || "");
    const { data: currentLoansCount, isLoading: isLoadingLoansCount } = useCurrentLoansCount();

    const { mutate: checkout } = useCheckout();
    const { mutate: submitReviewMutation } = useSubmitReview(bookId || "");

    // Digital Unlock State
    const [isDigitalUnlocked, setIsDigitalUnlocked] = useState(true);
    // Payment
    const [displayError, setDisplayError] = useState(false);

    const totalStars = useMemo(() => {
        const reviews = reviewsPage?.content || [];
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((acc, r) => acc + r.rating, 0);
        return Number((Math.round((total / reviews.length) * 2) / 2).toFixed(1));
    }, [reviewsPage]);

    if (isLoadingBook || isLoadingReview || isLoadingCheckedout || isLoadingLoansCount || isLoadingUserReview) {
        return <SpinnerLoading />;
    }

    if (isBookError || !book) {
        return <div className="container m-5">Something went wrong or book not found.</div>;
    }

    const handleCheckout = () => {
        checkout(bookId!, {
            onError: () => setDisplayError(true),
            onSuccess: () => setDisplayError(false)
        });
    };

    const handleSubmitReview = (starInput: number, reviewDescription: string) => {
        submitReviewMutation({ rating: starInput, reviewDescription });
    };

    return (
        <div>
            {/* Desktop View */}
            <div className="container d-none d-lg-block">
                {displayError && (
                    <div className="alert alert-danger mt-3" role="alert">
                        Please pay outstanding fees and/or return late book(s).
                    </div>
                )}
                <div className="row mt-5">
                    <div className="col-2">
                        <img src={book.img || defaultBookImg} width="226" height="349" alt="book" />
                    </div>

                    <div className="container col-4">
                        <div className="ml-2">
                            <h2>{book.title}</h2>
                            <h5 className="text-primary">{book.author}</h5>
                            <p className="lead">{book.description}</p>
                            <StarsReview rating={totalStars} size={32} />
                        </div>
                    </div>

                    <CheckoutAndReviewBox
                        book={book}
                        mobile={false}
                        isAuthenticated={isAuthenticated()}
                        isCheckedout={!!isBookCheckedout}
                        isDigitalUnlocked={isDigitalUnlocked}
                        currentLoansCount={currentLoansCount || 0}
                        checkoutBook={handleCheckout}
                        isReviewLeft={!!isReviewLeft}
                        submitReview={handleSubmitReview}
                    />
                </div>
                <hr />
                <LatestReviews reviews={reviewsPage?.content || []} bookId={book.id} mobile={false} />
            </div>

            {/* Mobile View */}
            <div className="container d-block d-lg-none mt-4">
                <div className="text-center mb-3">
                    <img src={book.img || defaultBookImg} width="226" height="349" alt="book" />
                </div>
                <div className="px-3 mb-3">
                    <h2>{book.title}</h2>
                    <h5 className="text-primary">{book.author}</h5>
                    <p className="lead">{book.description}</p>
                    <StarsReview rating={totalStars} size={32} />
                </div>
                <CheckoutAndReviewBox
                    book={book}
                    mobile={true}
                    isAuthenticated={isAuthenticated()}
                    isCheckedout={!!isBookCheckedout}
                    isDigitalUnlocked={isDigitalUnlocked}
                    currentLoansCount={currentLoansCount || 0}
                    checkoutBook={handleCheckout}
                    isReviewLeft={!!isReviewLeft}
                    submitReview={handleSubmitReview}
                />
                <hr />
                <LatestReviews reviews={reviewsPage?.content || []} bookId={book.id} mobile={true} />
            </div>
        </div>
    );
};
