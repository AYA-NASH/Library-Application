import { useEffect, useState } from "react";
import { BookModel } from "../../models/BookModel";
import { useParams } from "react-router-dom";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";

export const BookCheckoutPage = () => {
    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const { bookId } = useParams();

    useEffect(() => {
        const fetchBook = async () => {
            const url: string = `http://localhost:8080/api/books/${bookId}`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Something went wrong!");
            }

            const responseJson = await response.json();
            console.log("Fetched Book\n", responseJson);
            const loadedBook: BookModel = {
                id: responseJson.id,
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                copies: responseJson.copies,
                copiesAvailable: responseJson.copiesAvaliable,
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

    if (isLoading) {
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
                            <StarsReview rating={4} size={32} />
                        </div>
                    </div>
                    <CheckoutAndReviewBox book={book} mobile={false} />
                </div>
                <hr />
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
                    <StarsReview rating={4} size={32} />
                </div>
                <CheckoutAndReviewBox book={book} mobile={true} />

                <hr />
            </div>
        </div>
    );
};
