import { useQuery } from "@tanstack/react-query";
import { bookService } from "../../services/bookService";

// 1. Hook for the Book List (Search, Pagination, Categories)
export const useBooks = (page: number, size: number, text?: string, categoryId?: number) => {
    return useQuery({
        // The key includes all dependencies. If any change, it refetches.
        queryKey: ["books", { page, size, text, categoryId }],

        // We call our service here
        queryFn: () => bookService.getBooks(page, size, text, categoryId),

        // Senior Tip: Keep data "fresh" for 2 minutes to avoid constant reloading
        staleTime: 1000 * 60 * 2,
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
