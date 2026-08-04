import { useFetchBookSummary } from "@/api/hooks/BookHooks/useAdminBooks";
import { useBooks } from "@/api/hooks/BookHooks/useBooks";
import { useCategories } from "@/api/hooks/BookHooks/useCategories";
import { BookFormModal } from "@/components/dashboard-components/books/books-actions/BookFormModal";
import { DashboardPageLayout } from "@/components/dashboard-components/DashboardPageLayout";
import { DataTable } from "@/components/dashboard-components/table-components/DataTable";
import { Button } from "@/components/ui/button";
import { BookColumns } from "@/constants/admin-dashboard/books/booksColumns";
import { buildBooksSummaryCards, useBookFilters } from "@/constants/admin-dashboard/books/bookTableHelpers";

import { Archive, FolderOutput, Plus, TrashIcon } from "lucide-react";

export function Books() {
    const { data,
        isLoading: isLoadinBooks,
        isError: isErrorBooks,
        error,
        refetch: refetchBooks
    } = useBooks(1, 20);

    const { data: categoriesData } = useCategories(1, 100);

    const { data: bookSummary,
        isLoading: isLoadingSummary,
        isError: isErrorSummary,
    } = useFetchBookSummary();

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
                    <Button >
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
                searchFn={(book, search) => {
                    const query = search.toLowerCase();
                    const matchesTitle = book.title?.toLowerCase().includes(query) ?? false;
                    const matchesAuthor = book.author?.toLowerCase().includes(query) ?? false;

                    return matchesTitle || matchesAuthor;
                }}
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
    )
}