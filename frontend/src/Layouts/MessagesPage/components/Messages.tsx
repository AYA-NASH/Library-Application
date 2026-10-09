import { useState } from "react";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { useUserMessages } from "../../../api/hooks/LibraryServiceHooks/useMessage";
import { History, MessageSquareReply } from "lucide-react";

import { ApiErrorDisplay } from "../../Utils/ApiErrorDisplay";
import { EmptyState } from "@/Layouts/Utils/EmptyState";
import { SimplePagination } from "@/Layouts/Utils/Pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export const Messages = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const messagesPerPage = 5;

    const { data, isLoading, isError, error, refetch } = useUserMessages(currentPage, messagesPerPage);

    if (isLoading) return <SpinnerLoading />;

    if (isError) {
        return <ApiErrorDisplay error={error} title="Failed to load your messages" onRetry={() => refetch()} />;
    }

    const messages = data?.content || [];
    const totalPages = data?.totalPages || 0;

    if (messages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
                <EmptyState
                    icon={History}
                    title="No Messages history"
                    description="You haven't sent or received anything yet."
                />
            </div>
        );
    }

    return (
        <div className="w-full">
            <h5 className="mb-5 text-lg font-semibold tracking-tight text-foreground">
                Your Messages
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({data?.totalElements ?? 0})
                </span>
            </h5>

            <div className="flex flex-col gap-5">
                {messages.map((message) => {
                    const isResolved = Boolean(message.adminResponse);

                    return (
                        <Card
                            key={message.id}
                            className="overflow-hidden border-border/60 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <CardContent className="space-y-5 p-5 sm:p-6">
                                {/* Ticket header */}
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <Badge
                                        variant="outline"
                                        className={
                                            isResolved
                                                ? "border-success/30 bg-success/10 text-success"
                                                : "border-warning/30 bg-warning/10 text-warning"
                                        }
                                    >
                                        <span
                                            className={`mr-1.5 size-1.5 rounded-full ${isResolved ? "bg-success" : "bg-warning"
                                                }`}
                                        />
                                        {isResolved ? "Resolved" : "Awaiting response"}
                                    </Badge>

                                    <span className="font-mono text-xs text-muted-foreground">
                                        Ticket #{message.id}
                                    </span>
                                </div>

                                {/* User message */}
                                <div className="space-y-2">
                                    <h4 className="text-base font-semibold leading-snug text-foreground sm:text-lg">
                                        {message.title}
                                    </h4>

                                    <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                                        {message.question}
                                    </p>
                                </div>

                                <Separator />

                                {/* Administration response */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <MessageSquareReply className="size-4 text-primary" />

                                        <h6 className="text-sm font-semibold text-foreground">
                                            Administration response
                                        </h6>
                                    </div>

                                    {isResolved ? (
                                        <div className="rounded-lg border border-border/60 bg-muted/40 p-4">
                                            <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
                                                {message.adminResponse}
                                            </p>

                                            {message.adminName && (
                                                <p className="mt-3 text-xs font-medium text-muted-foreground">
                                                    — {message.adminName}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex items-start gap-3 rounded-lg border border-dashed border-border p-4">
                                            <MessageSquareReply className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                                            <p className="text-sm leading-5 text-muted-foreground">
                                                Your message has been received. Our
                                                administration team has not responded yet.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="mb-4 mt-8">
                <SimplePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};