import { useAdminOpenMessages } from "@/api/hooks/LibraryServiceHooks/useMessage";
import { messagesColumns } from "@/constants/admin-dashboard/messages/messagesColumns";
import { useDashboardTable } from "@/hooks/useDashboardTable"
import { DashboardPageLayout } from "@/components/dashboard-components/DashboardPageLayout";
import { MessageTicketCard } from "@/components/dashboard-components/messages/MessageTicketCard";
import { DataTablePagination } from "@/components/dashboard-components/table-components/DataTablePagination";
import { MessageTicketSkeleton } from "@/components/dashboard-components/messages/MessageTicketSkeleton";
import { QueryErrorAlert } from "@/components/error-handling/QueryErrorAlert";
import { PaginationState } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export function Messages() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 3
    });

    const {
        data,
        isLoading: isMessagesLoading,
        isError,
        error,
        refetch } = useAdminOpenMessages(pagination.pageIndex + 1, pagination.pageSize);

    const messages = data?.content ?? [];

    const table = useDashboardTable({
        data: messages,
        columns: messagesColumns,
        pageCount: data?.totalPages ?? -1,
        pagination,
        onPaginationChange: setPagination,
        manualPagination: true,
    });

    const rows = table.getRowModel().rows;

    useEffect(() => {
        const total = data?.totalPages ?? 0;
        if (total > 0 && pagination.pageIndex >= total) {
            setPagination((p) => ({ ...p, pageIndex: total - 1 }));
        }
    }, [data?.totalPages, pagination.pageIndex]);
    
    return (
        <DashboardPageLayout
            contentHeader="Messages Queues"
        >
            {isMessagesLoading ? (
                <MessageTicketSkeleton />
            ) : isError ? (
                <QueryErrorAlert
                    title="Failed to load messages"
                    description={
                        error?.message ||
                        "Unable to fetch messages from the server. Please try again."
                    }
                    onRetry={refetch}
                    className="max-w-none"
                />
            ) : (
                <div className="space-y-6">
                    {rows.map((row) => (
                        <MessageTicketCard
                            key={row.id}
                            ticket={row.original}
                        />
                    ))}

                    <DataTablePagination table={table} totalElements={data?.totalElements} />
                </div>
            )}
        </DashboardPageLayout>
    )
}