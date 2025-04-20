import { FC } from "react";
import { BookModel } from "../../../../models/BookModel";

export const ReturnBook: FC<{ book: BookModel }> = (props) => {
    const { img, title, author } = { ...props.book };
    return (
        <div className="col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3">
            <div className="text-center">
                {img ? (
                    <img src={img} width={151} height={233} alt="book" />
                ) : (
                    <img
                        src={require("../../../../Images/BooksImages/book-luv2code-1000.png")}
                        width={151}
                        height={233}
                        alt="book"
                    />
                )}
                <h6 className="mt-2">{title}</h6>
                <p>{author}</p>
                <a className="btn btn-dark text-white" href="#">
                    Reserve
                </a>
            </div>
        </div>
    );
};
