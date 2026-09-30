import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import { Table } from "@tanstack/react-table";

interface PaginationProps<TData> {
    table: Table<TData>
}

export function PaginationSection<TData>({
    table
}: PaginationProps<TData>) {
    const totalPages = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex + 1;

    if (totalPages <= 1) return null;

    const pageNumbers = [];

    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        pageNumbers.push(i);
    }
    return (
        <Pagination className="m-8">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => table.previousPage()}
                        className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>

                {pageNumbers.map((number) => (
                    <PaginationItem key={number}>
                        <PaginationLink
                            isActive={currentPage === number}
                            onClick={() => table.setPageIndex(number - 1)}
                            className="cursor-pointer"
                        >
                            {number}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext
                        onClick={() => table.nextPage()}
                        className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}