import React from "react";
import { HistoryModel } from "../../../models/HistoryModel";
import placeholder from '../../../Images/BooksImages/book-luv2code-1000.png';


interface HistoryItemProps {
    history: HistoryModel;
    isMobile: boolean;
}
export const HistoryItem: React.FC<HistoryItemProps> = ({ history, isMobile }) => {
    return (
        <div className="container">
            <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
                <div className="row g-0">
                    <div className="col-md-2">
                        <div className={isMobile ? "d-flex justify-content-center align-items-center" : ""}>
                            <img
                                src={history.img || placeholder}
                                width="123"
                                height="196"
                                alt="Book"
                            />
                        </div>
                    </div>
                    <div className="col">
                        <div className="card-body">
                            <h5 className="card-title"> {history.author} </h5>
                            <h4>{history.title}</h4>
                            <p className="card-text">{history.description}</p>
                            <hr />
                            <p className="card-text"> Checked out on: {history.checkoutDate}</p>
                            <p className="card-text"> Returned on: {history.returnedDate}</p>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
        </div>
    )
}