import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function SimplePagination({
    currentPage,
    totalPages,
    onPageChange
}: PaginationProps) {
    if (totalPages <= 1) return null;
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious 
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        aria-disabled={currentPage === 1}
                    />
                </PaginationItem>
                
                <PaginationItem>
                    <span className="text-sm text-muted-foreground px-4">
                        Page {currentPage} of {totalPages}
                    </span>
                </PaginationItem>

                <PaginationItem>
                    <PaginationNext 
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        aria-disabled={currentPage === totalPages}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}