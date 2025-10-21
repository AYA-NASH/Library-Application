import { useEffect, useState } from "react";
import { useAuth } from "../../../Auth/AuthContext";
import MessageModel from "../../../models/MessageModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { AdminMessage } from "./AdminMessage";
import AdminMessageRequest from "../../../models/AdminMessageRequest";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const AdminMessages = () => {
    const { user, token } = useAuth();

    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const [messages, setMessages] = useState<MessageModel[]>([]);

    const [messagesPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    // Recall useEffect
    const [btnSubmit, setBtnSubmit] = useState(false);

    useEffect(() => {
        const fetchUserMessages = async () => {
            if (user) {
                const url = `${
                    process.env.REACT_APP_API
                }/api/messages/search/findByClosed?closed=false&page=${
                    currentPage - 1
                }&size=${messagesPerPage}`;
                const requestOptions = {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Conetent-Type": "application/json",
                    },
                };

                const messageResponse = await fetch(url, requestOptions);

                if (!messageResponse.ok) {
                    throw new Error("Something went wrong");
                }

                const messageResponseJson = await messageResponse.json();

                setMessages(messageResponseJson._embedded.messages);
                setTotalPages(messageResponseJson.page.totalPages);
            }
            setIsLoadingMessages(false);
        };

        fetchUserMessages().catch((error: any) => {
            setHttpError(error.message);
            setIsLoadingMessages(false);
        });

        window.scrollTo(0, 0);
    }, [token, currentPage, btnSubmit]);

    if (isLoadingMessages) {
        return <SpinnerLoading />;
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    async function submitResponseToQuestion(id: number, response: string) {
        const url = `${baseUrl}/messages/secure/admin/message`;
        if (token && id !== null && response !== null) {
            const messageAdminRequestAdmin: AdminMessageRequest =
                new AdminMessageRequest(id, response);
            const requestOptions = {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(messageAdminRequestAdmin),
            };

            const messageAdminRequestAdminResponse = await fetch(
                url,
                requestOptions
            );

            if (!messageAdminRequestAdminResponse.ok) {
                throw new Error("Something went wrong");
            }

            setBtnSubmit(!btnSubmit);
        }
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="mt-3">
            {messages.length > 0 ? (
                <>
                    <h5>Pending Q/A: </h5>
                    {messages.map((message) => (
                        <AdminMessage
                            message={message}
                            key={message.id}
                            submitResponseToQuestion={submitResponseToQuestion}
                        />
                    ))}
                </>
            ) : (
                <h5>No Pending Q/A</h5>
            )}

            {totalPages > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    paginate={paginate}
                />
            )}
        </div>
    );
};
