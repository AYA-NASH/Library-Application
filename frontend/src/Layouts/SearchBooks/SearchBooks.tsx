import { FC } from "react";
import { BookModel } from "../../models/BookModel";
import { Link } from "react-router-dom";
import defaultBookImg from '../../Images/BooksImages/book-luv2code-1000.png';

export const SearchBooks: FC<{ book: BookModel }> = (props) => {
    const { id, img, title, author, description } = { ...props.book };
    return (
        <div className="card mt-3 shadow p-3 bg-body-rounded">
            <div className="row g-0">
                <div className="col-md-2">
                    <div className="d-none d-lg-block">
                        {img ? (
                            <img
                                src={img}
                                width={151}
                                height={233}
                                alt="book"
                            />
                        ) : (
                            <img
                                src={defaultBookImg}
                                width={123}
                                height={196}
                                alt="book"
                            />
                        )}
                    </div>
                    <div className="d-lg-none d-flex justify-content-center align-items-center">
                        {img ? (
                            <img
                                src={img}
                                width={151}
                                height={233}
                                alt="book"
                            />
                        ) : (
                            <img
                                src={defaultBookImg}
                                width={123}
                                height={196}
                                alt="book"
                            />
                        )}
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card-body">
                        <h5 className="card-title">{author}</h5>
                        <h4>{title}</h4>
                        <p className="card-text">{description}</p>
                    </div>
                </div>

                <div className="col-md-4 d-flex justify-content-center align-items-center">
                    <Link
                        className="btn btn-md btn-dark text-white"
                        to={`/checkout/${id}`}
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};
