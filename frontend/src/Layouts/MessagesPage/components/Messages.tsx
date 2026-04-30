import { useState } from "react";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { useUserMessages } from "../../../api/hooks/LibraryServiceHooks/useMessage";

import { ApiErrorDisplay } from "../../Utils/ApiErrorDisplay";

export const Messages = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const messagesPerPage = 5;

    const { data, isLoading, isError, error, refetch } = useUserMessages(currentPage, messagesPerPage);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    if (isLoading) return <SpinnerLoading />;

    if (isError) {
        return <ApiErrorDisplay error={error} title="Failed to load your messages" onRetry={() => refetch()} />;
    }

    const messages = data?.content || [];
    const totalPages = data?.totalPages || 0;

    return (
        <div className="mt-2">
            {messages.length > 0 ? (
                <div className="d-flex flex-column gap-4">
                    {messages.map((message) => (
                        <div key={message.id} className="card border-0 shadow-sm rounded-4 overflow-hidden">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <span className={`badge rounded-pill ${message.adminResponse ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                                        {message.adminResponse ? '● Resolved' : '● In Progress'}
                                    </span>
                                    <small className="text-muted fw-mono">Ticket ID: #{message.id}</small>
                                </div>

                                <h4 className="fw-bold mb-2">{message.title}</h4>
                                <p className="text-dark bg-light p-3 rounded-3">{message.question}</p>

                                <div className="ms-4 mt-4 border-start border-4 border-primary-subtle ps-4">
                                    <h6 className="fw-bold text-primary mb-2">
                                        <i className="bi bi-reply-fill me-2"></i>Administration Response
                                    </h6>
                                    {message.adminResponse ? (
                                        <div className="p-3 bg-primary-subtle rounded-3 text-dark">
                                            <p className="mb-0">{message.adminResponse}</p>
                                            <small className="d-block mt-2 text-primary fw-semibold">— {message.adminName}</small>
                                        </div>
                                    ) : (
                                        <p className="text-muted fst-italic">Waiting for a response...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-5">
                    <i className="bi bi-chat-dots display-1 text-light"></i>
                    <h5 className="mt-3 text-muted">No messages found in your history.</h5>
                </div>
            )}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                paginate={paginate}
            />
        </div>
    );
};