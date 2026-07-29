import { useBooks } from "@/api/hooks/BookHooks/useBooks";
import { DashboardPageLayout } from "@/components/dashboard-components/DashboardPageLayout";
import { DataTable } from "@/components/dashboard-components/table-components/DataTable";
import { Button } from "@/components/ui/button";
import { BookColumns } from "@/constants/admin-dashboard/books/booksColumns";
import { booksFiltersData } from "@/constants/admin-dashboard/books/booksFiltersData";
import { booksCards } from "@/constants/admin-dashboard/books/fakeData";
import { Archive, FolderOutput, Plus, TrashIcon } from "lucide-react";

export function Books() {

    const { data } = useBooks(1, 20);
    const books = data?.content ?? [];
    const totalElements = data?.totalElements ?? 0;
    const totalPages = data?.totalPages ?? 0;

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
                searchableColumns={["title", "author"]}
                searchPlaceholder="Search by book title or author ..."
                filters={booksFiltersData}  
                // searchFn={(book, search) =>
                //     book.title.toLowerCase().includes(search) ||
                //     book.author?.toLowerCase().includes(search)
                // }
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