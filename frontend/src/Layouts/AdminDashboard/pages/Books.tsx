import { useFetchBookSummary } from "@/api/hooks/BookHooks/useAdminBooks";
import { useBooks } from "@/api/hooks/BookHooks/useBooks";
import { useCategories } from "@/api/hooks/BookHooks/useCategories";
import { BookFormModal } from "@/components/dashboard-components/books/books-actions/BookFormModal";
import { DashboardPageLayout } from "@/components/dashboard-components/DashboardPageLayout";
import { DataTable } from "@/components/dashboard-components/table-components/DataTable";
import { Button } from "@/components/ui/button";
import { BookColumns } from "@/constants/admin-dashboard/books/booksColumns";
import { buildBooksSummaryCards, useBookFilters } from "@/constants/admin-dashboard/books/bookTableHelpers";
import { useDebounce } from "@/hooks/useDebounce";
import { ColumnFiltersState, OnChangeFn, PaginationState } from "@tanstack/react-table";

import { Archive, FolderOutput, Plus, TrashIcon } from "lucide-react";
import { useState } from "react";

export function Books() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 5,
    });
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 400);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const statusFilter = columnFilters.find((f) => f.id === "status")?.value as string | undefined;
    const categoryFilterStr = columnFilters.find((f) => f.id === "categories")?.value as string | undefined;
    const categoryId = categoryFilterStr ? Number(categoryFilterStr) : undefined;
    const dataSourceFilter = columnFilters.find((f) => f.id === "dataSource")?.value as string | undefined;

    const {
        data,
        isLoading: isLoadinBooks,
        isError: isErrorBooks,
        error,
        refetch: refetchBooks,
    } = useBooks(
        pagination.pageIndex + 1,
        pagination.pageSize,
        debouncedSearch || undefined,
        categoryId,
        statusFilter,
        dataSourceFilter
    );

    const { data: categoriesData } = useCategories(1, 100);

    const {
        data: bookSummary,
        isLoading: isLoadingSummary,
        isError: isErrorSummary,
    } = useFetchBookSummary();

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPagination((p) => ({ ...p, pageIndex: 0 }));
    };

    const handleColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (updater) => {
        setColumnFilters(updater);
        setPagination((p) => ({ ...p, pageIndex: 0 }));
    };

    const books = data?.content ?? [];
    const categories = categoriesData?.content;

    const filters = useBookFilters(books, categories);
    const booksCards = buildBooksSummaryCards(bookSummary);

    return (
        <DashboardPageLayout
            summaryCards={booksCards}
            isLoadingSummary={isLoadingSummary}
            isErrorSummary={isErrorSummary}
            contentHeader="Books"
            contentSubDescription="Manage your library catalog"
            contentAction={
                <BookFormModal trigger={
                    <Button>
                        <Plus />
                        Add Book
                    </Button>
                } />
            }
        >
            <DataTable
                columns={BookColumns}
                data={books}
                isLoading={isLoadinBooks}
                isError={isErrorBooks}
                error={error}
                onRetry={refetchBooks}
                searchPlaceholder="Search by book title or author ..."
                filters={filters}
                pagination={pagination}
                onPaginationChange={setPagination}
                pageCount={data?.totalPages ?? -1}
                totalElements={data?.totalElements}
                globalFilter={search}
                onGlobalFilterChange={handleSearchChange}
                columnFilters={columnFilters}
                onColumnFiltersChange={handleColumnFiltersChange}
                bulkActions={() => (
                    <div>
                        <Button variant="outline">
                            <Archive /> Archive
                        </Button>
                        <Button variant="outline">
                            <FolderOutput /> Export
                        </Button>
                        <Button variant="outline">
                            <TrashIcon /> Delete
                        </Button>
                    </div>
                )}
            />
        </DashboardPageLayout>
    );
}
