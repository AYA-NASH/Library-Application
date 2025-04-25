import { FC } from "react";
import { ReviewModel } from "../../models/ReviewModel";
import { StarsReview } from "./StarsReview";

export const Review: FC<{ review: ReviewModel }> = (props) => {
    const { userEmail, reviewDescription, rating } = { ...props.review };

    const date = new Date(props.review.date);

    const dateRender =
        date.toLocaleString("en-us", { month: "long" }) +
        " " +
        date.getDate() +
        " " +
        date.getFullYear();
    return (
        <div>
            <div className="col-8">
                <h5>{userEmail}</h5>
                <div className="row">
                    <div className="col">{dateRender}</div>

                    <div className="col">
                        <StarsReview rating={rating} size={16} />
                    </div>

                    <div className="mt-2">
                        <p>{reviewDescription}</p>
                    </div>
                </div>
            </div>
            <hr />
        </div>
    );
};
