import { useEffect, useState } from "react";
import { BookModel } from "../../models/BookModel";
import { useParams } from "react-router-dom";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { ReviewModel } from "../../models/ReviewModel";
import { LatestReviews } from "./LatestReviews";
import { useAuth } from "../../Auth/AuthContext";
import ReviewRequestModel from "../../models/ReviewRequestModel";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const BookCheckoutPage = () => {
    const { user, token } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(
        token ? true : false
    );

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Review Sates:
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    // Checkedout state
    const [isBookCheckedout, setIsBookCheckedout] = useState(false);
    const [isLoadingCheckedout, setIsLoadingCheckedout] = useState(true);

    // Current Loans Count States
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] =
        useState(true);

    // Payment
    const [displayError, setDisplayError] = useState(false);

    const { bookId } = useParams();

    const fetchIsCheckedout = async () => {
        if (isAuthenticated) {
            const url =`${baseUrl}/books/secure/is-checked-out/byuser?bookId=${bookId}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Something went wrong");
            }

            const responseJson = await response.json();
            setIsBookCheckedout(responseJson);
        }

        setIsLoadingCheckedout(false);
    };

    const fetchCurrentLoansCount = async () => {
        if (isAuthenticated) {
            const url = baseUrl + "/books/secure/current-loans/count";
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Something went wrong");
            }

            const responseJson = await response.json();
            setCurrentLoansCount(responseJson);
        }
        setIsLoadingCurrentLoansCount(false);
    };

    useEffect(() => {
        const fetchBook = async () => {
            const url: string = `${baseUrl}/books/${bookId}`;

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
    }, [isBookCheckedout]);

    useEffect(() => {
        const fetchBookReviews = async () => {
            const url: string = `${baseUrl}/reviews/search/findByBookId?bookId=${bookId}`;
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
    }, [isReviewLeft]);

    useEffect(() => {
        const fetchUserReviewBook = async () => {
            if (isAuthenticated) {
                const url = `${baseUrl}/reviews/secure/user/book?bookId=${bookId}`;
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: "Bearer " + token,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw Error("Something went wrong!");
                }

                const responseJson = await response.json();
                setIsReviewLeft(responseJson);
            }
            setIsLoadingUserReview(false);
        };
        fetchUserReviewBook().catch((error: any) => {
            setIsLoadingUserReview(false);
            setHttpError(error);
        });
    }, [isReviewLeft]);

    useEffect(() => {
        fetchIsCheckedout().catch((error: any) => {
            setIsLoadingCheckedout(false);
            setHttpError(error);
        });
    }, [isAuthenticated]);

    useEffect(() => {
        fetchCurrentLoansCount().catch((error: any) => {
            setIsLoadingCurrentLoansCount(false);
            setHttpError(error);
        });
    }, [isAuthenticated, isBookCheckedout]);

    async function checkoutBook() {
        const url = `${baseUrl}/books/secure/checkout?bookId=${bookId}`;
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            setDisplayError(true);
            throw new Error("Something went wrong!");
        }

        setDisplayError(false);
        setIsBookCheckedout(true);
    }

    async function submitReview(starInput: number, reviewDescription: string) {
        const reviewRequestModel = new ReviewRequestModel(
            Number(bookId),
            starInput,
            reviewDescription
        );
        const url = `${baseUrl}/reviews/secure`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reviewRequestModel),
        });

        if (!response.ok) {
            throw Error("Something went wrong");
        }

        setIsReviewLeft(true);
    }

    if (
        isLoading ||
        isLoadingReview ||
        isLoadingCheckedout ||
        isLoadingCurrentLoansCount ||
        isLoadingUserReview
    ) {
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
                {displayError && (
                    <div className="alert alert-danger" role="alert">
                        Please pay outstanding fees and/or return late book(s).
                    </div>
                )}
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

                    <CheckoutAndReviewBox
                        book={book}
                        mobile={false}
                        isAuthenticated={isAuthenticated}
                        isCheckedout={isBookCheckedout}
                        currentLoansCount={currentLoansCount}
                        checkoutBook={checkoutBook}
                        isReviewLeft={isReviewLeft}
                        submitReview={submitReview}
                    />
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
                {displayError && (
                    <div className="alert alert-danger" role="alert">
                        Please pay outstanding fees and/or return late book(s).
                    </div>
                )}
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

                <CheckoutAndReviewBox
                    book={book}
                    mobile={true}
                    isAuthenticated={isAuthenticated}
                    isCheckedout={isBookCheckedout}
                    currentLoansCount={currentLoansCount}
                    checkoutBook={checkoutBook}
                    isReviewLeft={isReviewLeft}
                    submitReview={submitReview}
                />
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
