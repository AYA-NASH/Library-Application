import { Link } from "react-router-dom";
import { LoansModal } from "./LoansModal";
import { DueDateMessage } from "./DueDateMessage";
import { ShelfCurrentLoans } from "../../../models/ShelfCurrentLoans";
import placeholder from "../../../Images/BooksImages/book-luv2code-1000.png";

interface LoanItemProps {
    loan: ShelfCurrentLoans;
    isMobile: boolean,
    returnBook: (loan: ShelfCurrentLoans) => void;
    renewLoan: (bookId: number) => void;
}

export const LoanItem: React.FC<LoanItemProps> = ({ loan, isMobile, returnBook, renewLoan }) => (
    <div className="row mt-3 mb-3 align-items-center shadow-sm border-0" >
        <div className="col-md-4 d-flex align-items-center justify-content-center p-3">
            <img
                src={loan.book?.img || placeholder}
                width="226"
                height="349"
                alt={loan.book.title}
            />
        </div>

        <div className="card col-12 col-lg-6 mt-3 mt-lg-0 mx-auto border-0 shadow-sm">
            <div className="card-body">
                <h4 className="card-title">{loan.book.title}</h4>
                <DueDateMessage daysLeft={loan.daysLeft} />

                <div className="list-group mt-3">
                    <button
                        className="list-group-item list-group-item-action text-center"
                        data-bs-toggle="modal"
                        data-bs-target={`#modal${loan.book.id}`}
                    >
                        Manage Loan
                    </button>
                    <Link to="/search" className="list-group-item list-group-item-action text-center text-primary">
                        Search more books?
                    </Link>
                </div>
                <hr />
                <p className="text-muted small text-center">Help others by reviewing your loan.</p>
                <Link className="btn  btn-outline-dark w-100" to={`/checkout/${loan.book.id}`}>
                    Leave a review
                </Link>
            </div>

        </div>

        <LoansModal
            shelfCurrentLoan={loan}
            returnBook={returnBook}
            renewLoan={renewLoan}
            mobile={isMobile}
        />
    </div>
);