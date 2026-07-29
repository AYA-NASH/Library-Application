import { useBooks } from "@/api/hooks/BookHooks/useBooks";
import { useCategories } from "@/api/hooks/BookHooks/useCategories";
import { DashboardPageLayout } from "@/components/dashboard-components/DashboardPageLayout";
import { DataTable } from "@/components/dashboard-components/table-components/DataTable";
import { Button } from "@/components/ui/button";
import { BookColumns } from "@/constants/admin-dashboard/books/booksColumns";
import {useBookFilters } from "@/constants/admin-dashboard/books/booksFiltersData";
import { booksCards } from "@/constants/admin-dashboard/books/fakeData";
import { Archive, FolderOutput, Plus, TrashIcon } from "lucide-react";

export function Books() {

    const { data } = useBooks(1, 20);
    const { data: categoriesData } = useCategories(1, 100);
    const books = data?.content ?? [];
    const categories = categoriesData?.content;
    const totalElements = data?.totalElements ?? 0;
    const totalPages = data?.totalPages ?? 0;

    const filters = useBookFilters(books, categories);
    return (
        <DashboardPageLayout
            summaryCards={booksCards}
            contentHeader="Books"
            contentSubDescription="Manage your library catalog"
            contentAction={
                <Button>
                    <Plus />
                    Add Book
                </Button>
            }
        >
            <DataTable
                columns={BookColumns}
                data={books}
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