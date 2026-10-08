import { useState } from "react";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import { History } from "lucide-react";
import { useGetUserBooksHistory } from "../../../api/hooks/BookHooks/useHistory";
import { HistoryItem } from "./HistoryItem";

import { ApiErrorDisplay } from "../../Utils/ApiErrorDisplay";
import { EmptyState } from "@/Layouts/Utils/EmptyState";
import { SimplePagination } from "@/Layouts/Utils/Pagination";

export const HistoryPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const {
        data: histories,
        isLoading,
        isError,
        error: httpError,
        refetch
    } = useGetUserBooksHistory(currentPage, pageSize);

    if (isLoading) return <SpinnerLoading />;

    if (isError) {
        return <ApiErrorDisplay error={httpError} title="Failed to load history" onRetry={() => refetch()} />;
    }

    const historyList = histories?.content || [];
    const totalPages = histories?.totalPages || 0;

    if (historyList.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
                <EmptyState
                    icon={History}
                    title="No reading history"
                    description="You haven't borrowed and returned any books yet."
                    action={
                        <Link to="/search">Explore Library</Link>
                    }
                />
            </div>
        );
    }

    return (
        <div className="w-full">
            <h5 className="mb-6 text-foreground text-lg font-medium">Recent History: {histories?.totalElements}</h5>

            <div className="flex flex-col gap-6">
                {historyList.map((history) => (
                    <HistoryItem key={history.id} history={history} />
                ))}
            </div>

            <div className="mt-8 mb-4">
                <SimplePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

