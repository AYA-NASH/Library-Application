import { useState } from "react";
import { Link } from "react-router-dom";
import { ShelfCurrentLoans } from "../../../models/ShelfCurrentLoans";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";

import { useCurrentLoans, useRenewLoan, useReturnBook } from "../../../api/hooks/BookHooks/useLoans";
import { toast } from "sonner";
import { LoanItem } from "./LoanItem";
import { useIsMobile } from "../../Utils/useIsMobile";

export const Loans = () => {
    const isMobile = useIsMobile();

    const { data: shelfCurrentLoans,
        isLoading: isLoadingUserLoans,
        isError,
        error: httpError
    } = useCurrentLoans(1, 10);

    const { mutate: returnBookMutation } = useReturnBook();
    const { mutate: renewLoanMutation } = useRenewLoan();

    const [checkout, setCheckout] = useState(false);


    const [lateReturnMessage, setLateReturnMessage] = useState<string | null>(null);

    const lateReturnMsg = () => {
        setLateReturnMessage("You returned a late book. Please visit the Fees page to pay your fees before checking out new books.");
        setTimeout(() => setLateReturnMessage(null), 5000); // auto-hide after 5s
    };

    if (isLoadingUserLoans) {
        return <SpinnerLoading />;
    }

    if (isError) {
        return (
            <div className="container m-5">
                {httpError.message}
            </div>
        );
    }

    async function returnBook(shelfCurrentLoan: ShelfCurrentLoans) {
        const bookId = shelfCurrentLoan.book.id;
        const isLate = shelfCurrentLoan.daysLeft < 0;
        returnBookMutation(bookId, {
            onSuccess: () => {
                setCheckout(!checkout);
                if (isLate) lateReturnMsg();
                toast.success(`${shelfCurrentLoan.book.title} is returned`);
            }, onError: () => {
                toast.error("Something went wrong!");
            }
        }
        );
    }

    async function renewLoan(bookId: number) {
        renewLoanMutation(bookId, {
            onSuccess: () => {
                setCheckout(!checkout);
                toast.success("you renewed checkout due-date, remeber to return it back in next 7-days");
            }, onError: () => {
                toast.error("Something went wrong!");
            }
        }
        );
    }

    if (!shelfCurrentLoans || shelfCurrentLoans.content.length === 0) {
        return (
            <div className="container mt-5 text-center">
                <div className="p-5 bg-light rounded-3">
                    <h3>Currently no loans</h3>
                    <p>Looks like you haven't borrowed anything yet.</p>
                    <Link className="btn btn-dark btn-lg" to="/search">Explore Library</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            {lateReturnMessage && (
                <div className="alert alert-danger mt-3" role="alert">
                    {lateReturnMessage}
                </div>
            )}

            <h5 className="mt-4">Current Loans:</h5>
            <hr />

            {shelfCurrentLoans.content.map((loan) => (
                <div key={loan.book.id}>
                    <LoanItem
                        loan={loan}
                        isMobile={isMobile}
                        returnBook={returnBook}
                        renewLoan={renewLoan}
                    />
                    <hr className="d-lg-none" />
                </div>
            ))}
            <div className="card-footer bg-white border-top-0 py-3">
                <Link to="/search" className="text-decoration-none text-muted hover-dark">
                    ← Borrow something else?
                </Link>
            </div>
        </div>
    );
};
