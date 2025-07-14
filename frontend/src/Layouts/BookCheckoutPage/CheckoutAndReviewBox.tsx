import { FC, useEffect, useState } from "react";
import { BookModel } from "../../models/BookModel";
import { Link } from "react-router-dom";

export const CheckoutAndReviewBox: FC<{
    book: BookModel | undefined;
    mobile: boolean;
    isAuthenticated: boolean;
    isCheckedout: boolean;
    currentLoansCount: number;
    checkoutBook: any;
}> = (props) => {

    function buttonRender(){
        if(props.isAuthenticated){
            if(!props.isCheckedout && props.currentLoansCount < 5){
                return (<button onClick={()=> props.checkoutBook()} className="btn btn-success btn-lg">Checkout</button>)
            }
            else if(props.isCheckedout){
                return (<p><b>Book Checkedout. Enjoy!</b></p>)
            }
            else if(!props.isCheckedout){
                return (<p className="text-danger">Too many books checkedout.</p>)
            }
        }
        return (<Link to="/login" className="btn btn-success btn-lg">Sign in</Link>)
    }

    return (
        <div
            className={
                props.mobile
                    ? "card d-flex mt-5"
                    : "card col-3 container d-flex mb-5"
            }
        >
            <div className="card-body container">
                <div className="mt-3">
                    <p>
                        <b> {props.currentLoansCount} /5 </b>
                        books checked out
                    </p>

                    <hr />

                    {props.book &&
                    props.book.copiesAvailable &&
                    props.book.copiesAvailable > 0 ? (
                        <h4 className="text-success">Available</h4>
                    ) : (
                        <h4 className="text-danger">Wait List</h4>
                    )}

                    <div className="row">
                        <p className="col-6 lead">
                            <b>{props.book?.copies} </b>
                            copies
                        </p>

                        <p className="col-6 lead">
                            <b>{props.book?.copiesAvailable} </b>
                            Available
                        </p>
                    </div>
                </div>

                {buttonRender()}

                <hr />

                <p className="mt-3">
                    This number can change until placing order has been
                    completed.
                </p>
                <p>Sign in to be able to leave a review.</p>
            </div>
        </div>
    );
};
