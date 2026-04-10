import { ReturnBook } from "./ReturnBook";
import { SpinnerLoading } from "../../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import "./Carousel.css";
import { useBooks } from "../../../../api/hooks/BookHooks/useBooks";

export const Carousel = () => {
    const { data, isLoading, isError, error } = useBooks(1, 9);

    if (isLoading) {
        return <SpinnerLoading />;
    }

    if (isError) {
        return (
            <div className="container mt-5">
                <p className="text-danger">Error: {error.message}</p>
            </div>
        );
    }

    const books = data?.content ?? [];

    return (
        <div className="container mt-5">
            <div className="homepage-carousel-title mt-3">
                <h3>Find your next</h3>
            </div>
            <div
                id="booksCarousel"
                className="carousel carousel-dark slide mt-5 d-none d-lg-block"
                data-bs-interval="false"
            >
                {/* Desktop View */}
                <div className="carousel-inner">
                    {Array.from({ length: Math.ceil(books.length / 3) }).map(
                        (_, index) => (
                            <div
                                className={`carousel-item ${index === 0 ? "active" : ""}`}
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
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>

                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#booksCarousel"
                    data-bs-slide="next"
                >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            <div className="d-lg-none mt-3">
                <div className="row d-flex justify-content-center align-items-center">
                    {books.length > 0 && (
                        <ReturnBook book={books[0]} key={books[0].id} />
                    )}
                </div>
            </div>

            <div className="homepage-carousel-title mt-3">
                <Link className="btn btn-outline-secondary btn-lg" to={'search'}>View More</Link>
            </div>
        </div>
    );
};