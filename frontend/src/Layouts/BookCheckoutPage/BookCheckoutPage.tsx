import { useEffect, useState } from "react";
import { BookModel } from "../../models/BookModel";
import { useParams } from "react-router-dom";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { ReviewModel } from "../../models/ReviewModel";
import { LatestReviews } from "./LatestReviews";

export const BookCheckoutPage = () => {
    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    const { bookId } = useParams();

    useEffect(() => {
        const fetchBook = async () => {
            const url: string = `http://localhost:8080/api/books/${bookId}`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Something went wrong!");
            }

            const responseJson = await response.json();
            const loadedBook: BookModel = {
                id: responseJson.id,
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                copies: responseJson.copies,
                copiesAvailable: responseJson.copiesAvailable,
                category: responseJson.category,
                img: responseJson.img,
            };
            setBook(loadedBook);
            setIsLoading(false);
        };
        fetchBook().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        });
    }, []);

    useEffect(() => {
        const fetchBookReviews = async () => {
            const url: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Something went wrong!");
            }
            const responseJson = await response.json();
            const responseData = responseJson._embedded.reviews;

            const loadedReviews: ReviewModel[] = [];

            let weightedStarReviews = 0;

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    rate: responseData[key].rate,
                    bookId: responseData[key].bookId,
                    reviewDescription: responseData[key].reviewDescription,
                });
                weightedStarReviews += responseData[key].rating;
            }

            if (loadedReviews) {
                const round = (
                    Math.round(
                        (weightedStarReviews / loadedReviews.length) * 2
                    ) / 2
                ).toFixed(1);

                setTotalStars(Number(round));
            }

            setReviews(loadedReviews);
            setIsLoadingReview(false);
        };
        fetchBookReviews().catch((error: any) => {
            setIsLoadingReview(false);
            setHttpError(error.message);
        });
    }, []);

    if (isLoading || isLoadingReview) {
        return <SpinnerLoading />;
    }

    if (httpError) {
        return (
            <div className="container">
                <p>{httpError}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="container d-none d-lg-block">
                <div className="row mt-5">
                    <div className="col-2">
                        {book?.img ? (
                            <img
                                src={book.img}
                                width="226"
                                height="349"
                                alt="book"
                            />
                        ) : (
                            <img
                                src={require("../../../../Images/BooksImages/book-luv2code-1000.png")}
                                width={226}
                                height={349}
                                alt="book"
                            />
                        )}
                    </div>

                    <div className="container col-4">
                        <div className="ml-2">
                            <h2>{book?.title}</h2>
                            <h5 className="text-primary">{book?.author}</h5>
                            <p className="lead">{book?.description}</p>
                            <StarsReview rating={totalStars} size={32} />
                        </div>
                    </div>
                    <CheckoutAndReviewBox book={book} mobile={false} />
                </div>
                <hr />
                <LatestReviews
                    reviews={reviews}
                    bookId={book?.id}
                    mobile={false}
                />
            </div>
            {/* mobile view */}
            <div className="container d-block d-lg-none mt-4">
                <div className="text-center mb-3">
                    {book?.img ? (
                        <img
                            src={book.img}
                            width="226"
                            height="349"
                            alt="book"
                        />
                    ) : (
                        <img
                            src={require("../../../../Images/BooksImages/book-luv2code-1000.png")}
                            width={226}
                            height={349}
                            alt="book"
                        />
                    )}
                </div>

                <div className="px-3 mb-3">
                    <h2>{book?.title}</h2>
                    <h5 className="text-primary">{book?.author}</h5>
                    <p className="lead">{book?.description}</p>
                    <StarsReview rating={totalStars} size={32} />
                </div>

                <CheckoutAndReviewBox book={book} mobile={true} />
                <hr />
                <LatestReviews
                    reviews={reviews}
                    bookId={book?.id}
                    mobile={true}
                />
            </div>
        </div>
    );
};
