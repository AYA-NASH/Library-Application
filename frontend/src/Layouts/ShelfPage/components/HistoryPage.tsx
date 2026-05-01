import { useState } from "react";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import { Pagination } from "../../Utils/Pagination";
import { useGetUserBooksHistory } from "../../../api/hooks/BookHooks/useHistory";
import { HistoryItem } from "./HistoryItem";
import { HistoryModel } from "../../../models/HistoryModel";
import { useIsMobile } from "../../Utils/useIsMobile";

import { ApiErrorDisplay } from "../../Utils/ApiErrorDisplay";

export const HistoryPage: React.FC = () => {
    const isMobile = useIsMobile();
    const [currentPage, setCurrentPage] = useState(1);
    const {
        data: histories,
        isLoading: isLoadingHistory,
        isError,
        error: httpError,
        refetch
    } = useGetUserBooksHistory(currentPage, 2);

    if (isLoadingHistory) return <SpinnerLoading />;

    if (isError) {
        return <ApiErrorDisplay error={httpError} title="Failed to load history" onRetry={() => refetch()} />;
    }

    if (!histories || histories.content.length === 0) {
        return (
            <div className="container mt-5 text-center">
                <h3>Currently no history</h3>
                <Link className="btn btn-dark mt-2" to="/search">
                    Search for new book
                </Link>
            </div>
        );
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="container mt-4">
            <h5 className="fw-bold mb-4">Recent History:</h5>

            {histories.content.map((history: HistoryModel) => (
                <HistoryItem key={history.id} history={history} isMobile={isMobile} />
            ))}

            {histories.totalPages > 1 && (
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={histories.totalPages}
                        paginate={paginate}
                    />
                </div>
            )}
        </div>
    );
};

