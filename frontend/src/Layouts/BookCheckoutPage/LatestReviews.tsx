import { FC } from "react";
import { ReviewModel } from "../../models/ReviewModel";
import { Link } from "react-router-dom";
import { Review } from "../Utils/Review";

export const LatestReviews: FC<{
    reviews: ReviewModel[];
    bookId: number | undefined;
    mobile: boolean;
}> = (props) => {
    return (
        <div className={props.mobile ? "mt-3" : "row mt-5"}>
            <div className={props.mobile ? "" : "col-2"}>
                <h2>Latest Reviews</h2>
            </div>
            <div className="col-10">
                {props.reviews.length > 0 ? (
                    <>
                        {props.reviews.slice(0, 3).map((review) => (
                            <Review review={review} key={review.id} />
                        ))}

                        <div className="m-3">
                            <Link
                                type="button"
                                className="btn btn-dark btn-md text-white"
                                to={`/reviewList/${props.bookId}`}
                            >
                                Reach all Reviews
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="m-3">
                        <p className="lead">
                            Currently there are no reviews for this book
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
