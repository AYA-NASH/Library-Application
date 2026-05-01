import { useState } from "react";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { AdminMessage } from "../components/AdminMessage";
import { useAdminOpenMessages } from "../../../api/hooks/LibraryServiceHooks/useMessage";

import { ApiErrorDisplay } from "../../Utils/ApiErrorDisplay";

export const AdminMessages = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const messagesPerPage = 5;

    const { data, isLoading, isError, error, refetch } = useAdminOpenMessages(currentPage, messagesPerPage);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    if (isLoading) return <SpinnerLoading />;

    if (isError) {
        return <ApiErrorDisplay error={error} title="Failed to load admin messages" onRetry={() => refetch()} />;
    }

    const messages = data?.content || [];
    const totalPages = data?.totalPages || 0;
    const totalElements = data?.totalElements || 0;

    return (
        <div className="mt-4">
            <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-3">
                <div>
                    <h3 className="fw-bold text-dark mb-1">Message Queue</h3>
                    <p className="text-muted mb-0">Manage and respond to user inquiries.</p>
                </div>
                <div className="text-end">
                    <span className="h4 fw-bold text-primary mb-0">{totalElements}</span>
                    <p className="small text-uppercase fw-bold text-secondary mb-0">Total Open Tickets</p>
                </div>
            </div>

            {messages.length > 0 ? (
                <div className="animate__animated animate__fadeIn">
                    {messages.map((message) => (
                        <AdminMessage
                            key={message.id}
                            message={message}
                        />
                    ))}
                </div>
            ) : (
                <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
                    <div className="py-4">
                        <i className="bi bi-check2-circle display-1 text-success opacity-50"></i>
                        <h4 className="mt-3 fw-bold text-dark">Inbox Zero!</h4>
                        <p className="text-muted">All customer questions have been addressed.</p>
                    </div>
                </div>
            )}

            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-5">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        paginate={paginate}
                    />
                </div>
            )}
        </div>
    );
};