import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { useBookDetails } from "../../api/hooks/BookHooks/useBooks";
import { useIsBookReviewedByUser, useReviews } from "../../api/hooks/BookHooks/useReviews";
import { ApiErrorDisplay } from "../Utils/ApiErrorDisplay";
import { BookCard } from "../Utils/BookCard";

export const BookPage = () => {

    const { bookId } = useParams<{ bookId: string }>();

    const { data: book, isLoading: isLoadingBook, isError: isBookError, error: bookError, refetch: refetchBook } = useBookDetails(bookId || "");    // Review Sates:
    const { data: reviewsPage, isLoading: isLoadingReview } = useReviews(bookId || "", 0, 3);
    const { data: isReviewLeft, isLoading: isLoadingUserReview } = useIsBookReviewedByUser(bookId || "");

    const [isDigitalUnlocked] = useState(true);

    // Payment
    // const [displayError, setDisplayError] = useState(false);

    const totalStars = useMemo(() => {
        const reviews = reviewsPage?.content || [];
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((acc, r) => acc + r.rating, 0);
        return Number((Math.round((total / reviews.length) * 2) / 2).toFixed(1));
    }, [reviewsPage]);

    if (isLoadingBook || isLoadingReview || isLoadingUserReview) {
        return <SpinnerLoading />;
    }

    if (isBookError || !book) {
        return <ApiErrorDisplay error={bookError} title="Failed to load book details" onRetry={() => refetchBook()} />;
    }

    return (
        <div className="mx-auto px-4 py-10">
            <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
                <div className="w-full lg:flex-1">
                    <BookCard book={book} showRate={true} stars={totalStars} />
                    {/* Future LatestReviews component goes here, flowing under the book details */}
                    {/* <LatestReviews reviews={reviewsPage?.content || []} bookId={book.id} /> */}
                </div>
                
                <CheckoutAndReviewBox
                    book={book}
                    isDigitalUnlocked={isDigitalUnlocked}
                    isReviewLeft={!!isReviewLeft}
                />
            </div>
        </div>
    );
};
