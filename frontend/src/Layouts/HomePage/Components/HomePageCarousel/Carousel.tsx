import { useEffect, useState } from "react";
import { BookModel } from "../../../../models/BookModel";

import { ReturnBook } from "./ReturnBook";

import "./Carousel.css";
import { SpinnerLoading } from "../../../Utils/SpinnerLoading";

export const Carousel = () => {
    // const booksArr: [] = [book1, book2, book3];
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            const url: string = "http://localhost:8080/api/books?page=0&size=9";
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Something went wrong!");
            }

            const responseJson = await response.json();
            const responseData = responseJson._embedded.books;
            // setBooks(responseJson._embedded.books);
            const loadedBooks: BookModel[] = [];
            for (const key in responseData) {
                loadedBooks.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    copiesAvailable: responseData[key].copiesAvailable,
                    category: responseData[key].category,
                    img: responseData[key].img,
                });
            }
            setBooks(loadedBooks);
            setIsLoading(false);
        };
        fetchBooks().catch((error: any) => {
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
        <div className="container mt-5">
            <div className="homepage-carousel-title mt-3">
                <h3>Find your next</h3>
            </div>
            <div
                id="booksCarousel"
                className="carousel carousel-dark slide mt-5 d-none d-lg-block"
                // data-bs-ride="carousel"
                data-bs-interval="false"
            >
                {/*Desktop*/}
                <div className="carousel-inner">
                    {Array.from({ length: Math.ceil(books.length / 3) }).map(
                        (_, index) => (
                            <div
                                className={`carousel-item ${
                                    index === 0 ? "active" : ""
                                }`}
                                key={index}
                            >
                                <div className="row d-flex justify-content-center align-items-center">
                                    {books
                                        .slice(index * 3, index * 3 + 3)
                                        .map((book) => (
                                            <ReturnBook
                                                key={book.id}
                                                book={book}
                                            />
                                        ))}
                                </div>
                            </div>
                        )
                    )}
                </div>

                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#booksCarousel"
                    data-bs-slide="prev"
                >
                    <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Previous</span>
                </button>

                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#booksCarousel"
                    data-bs-slide="next"
                >
                    <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            {/* Mobile View */}
            <div className="d-lg-none mt-3">
                <div className="row d-flex justify-content-center align-items-center">
                    <ReturnBook book={books[7]} key={books[7].id} />
                </div>
            </div>

            <div className="homepage-carousel-title mt-3">
                <a className="btn btn-outline-secondary btn-lg">View More</a>
            </div>
        </div>
    );
};
