import { SpinnerLoading } from "@/Layouts/Utils/SpinnerLoading";
import { ApiErrorDisplay } from "@/Layouts/Utils/ApiErrorDisplay";
import { SimplePagination } from "@/Layouts/Utils/Pagination";
import { EmptyState } from "@/Layouts/Utils/EmptyState";
import { useCurrentLoans } from "@/api/hooks/BookHooks/useLoans";
import { LoanCard } from "./LoanCard";
import { Link } from "react-router-dom";
import { useState } from "react";

export const Loans = () => {
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const {
        data: shelfCurrentLoans,
        isLoading: isLoadingUserLoans,
        isError,
        error: httpError
    } = useCurrentLoans(page, pageSize);

    if (isLoadingUserLoans) {
        return <SpinnerLoading />;
    }

    if (isError) {
        return <ApiErrorDisplay error={httpError} title="Failed to load loans" />;
    }

    const loans = shelfCurrentLoans?.content || [];
    const totalPages = shelfCurrentLoans?.totalPages || 0;

    if (loans.length === 0) {
        return (
            <div className="mt-28 mx-4">
                <EmptyState
                    title="Currently No Loans"
                    description="Looks like you haven't borrowed anything yet."
                    action={
                        <Link to="/search">Explore Library</Link>
                    }
                />
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl overflow-hidden mx-auto">

            <h5 className="my-6 text-foreground text-lg font-medium">Current Loans ({shelfCurrentLoans?.totalElements}):</h5>

            {loans.map((loan) => (
                <div key={loan.book.id} className="mb-6">
                    <LoanCard loan={loan} />
                </div>
            ))}

            {page === shelfCurrentLoans?.totalPages && (
                <div className="bg-card border rounded-2xl p-4">
                    <Link to="/search" className="text-md text-muted-foreground hover:text-accent-foreground">
                        ← Borrow something else?
                    </Link>
                </div>
            )}

            <div className="mt-8 mb-4">
                <SimplePagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
};
