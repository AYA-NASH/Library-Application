import { useState } from "react";
import { useParams } from "react-router-dom";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { useBookDetails } from "../../api/hooks/BookHooks/useBooks";
import { useIsBookReviewedByUser } from "../../api/hooks/BookHooks/useReviews";
import { ApiErrorDisplay } from "../Utils/ApiErrorDisplay";
import { BookCard } from "../Utils/BookCard";
import { BookReviewSection } from "./components/BookReviewsSection";

export const BookPage = () => {

    const { bookId } = useParams<{ bookId: string }>();

    const {
        data: book,
        isLoading: isLoadingBook,
        isError: isBookError,
        error: bookError,
        refetch: refetchBook
    } = useBookDetails(bookId || "");

    const { data: isReviewLeft, isLoading: isLoadingUserReview } = useIsBookReviewedByUser(bookId || "");

    const [isDigitalUnlocked] = useState(true);

    // Payment
    // const [displayError, setDisplayError] = useState(false);

    if (isLoadingBook || isLoadingUserReview) {
        return <SpinnerLoading />;
    }

    if (isBookError || !book) {
        return <ApiErrorDisplay error={bookError} title="Failed to load book details" onRetry={() => refetchBook()} />;
    }

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-10">

            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:grid-rows-[auto_1fr]">

                <div className="lg:col-start-1 lg:row-start-1">
                    <BookCard book={book} showRate={true} stars={book.averageRating} />
                </div>

                <aside className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-8 h-fit">
                    <CheckoutAndReviewBox
                        book={book}
                        isDigitalUnlocked={isDigitalUnlocked}
                        isReviewLeft={!!isReviewLeft}
                    />
                </aside>

                <div className="lg:col-start-1 lg:row-start-2 pt-4 lg:pt-0">
                    <BookReviewSection bookId={book.id} />
                </div>

            </div>
        </div>
    );
};
