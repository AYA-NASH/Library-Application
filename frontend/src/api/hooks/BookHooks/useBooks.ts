import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { bookService } from "../../services/bookService";

// 1. Hook for the Book List (Search, Pagination, Categories, Status, DataSource)
export const useBooks = (
    page: number,
    size: number,
    text?: string,
    categoryId?: number,
    status?: string,
    dataSource?: string
) => {
    return useQuery({
        queryKey: ["books", { page, size, text, categoryId, status, dataSource }],
        queryFn: () => bookService.getBooks(page, size, text, categoryId, status, dataSource),
        staleTime: 1000 * 60 * 2,
        placeholderData: keepPreviousData,
    });
};

// 2. Hook for a single Book's details
export const useBookDetails = (bookId: string | number) => {
    return useQuery({
        queryKey: ["book", bookId],
        queryFn: () => bookService.getBookById(bookId),
        enabled: !!bookId, // Only run if we actually have an ID
    });
};
