import book1 from "../../../../Images/BooksImages/book-luv2code-1000.png";
import book2 from "../../../../Images/BooksImages/new-book-1.png";
import book3 from "../../../../Images/BooksImages/new-book-2.png";

import { ReturnBook } from "./ReturnBook";
import "./Carousel.css";
export const Carousel = () => {
    const books: [] = [book1, book2, book3];
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
                    {books.map((book, index) => (
                        <div
                            className={`carousel-item ${
                                index === 0 ? "active" : ""
                            }`}
                            key={index}
                        >
                            <div className="row d-flex justify-content-center align-items-center">
                                <ReturnBook imgPath={book} />
                            </div>
                        </div>
                    ))}
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
                    <div className="text-center">
                        <img src={book1} width={151} height={233} alt="book" />
                        <h6 className="mt-2"></h6>
                        <p>Luv2code</p>
                        <a className="btn btn-dark text-white" href="#">
                            Reserve
                        </a>
                    </div>
                </div>
            </div>

            <div className="homepage-carousel-title mt-3">
                <a className="btn btn-outline-secondary btn-lg">View More</a>
            </div>
        </div>
    );
};
