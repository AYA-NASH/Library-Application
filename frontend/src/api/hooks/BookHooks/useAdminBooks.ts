import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { adminBookService } from "../../services/adminBookService"

export const useAddBook = () => {
    return useMutation({
        mutationFn: (book: FormData) => adminBookService.addBook(book),
        onSuccess: () => {
            // invalidate admin books query.
            console.log("Admin Adds a new Book Successfully");
        }
    });
};

export const useFetchEditInfo = (bookId: number) => {
    return useQuery({
        queryFn: () => adminBookService.fetchEditInfo(bookId),
        queryKey: ["book-edit-info", bookId]
    });
};

export const useFetchBookSummary = () => {
    return useQuery({
        queryFn: () => adminBookService.fetchBookSummary(),
        queryKey: ["books-summary"]
    })
}

export const useUpdateBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ bookId, formData }: {
            bookId: number,
            formData: FormData
        }) => adminBookService.updateBook(bookId, formData),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["books"] });
            queryClient.invalidateQueries({ queryKey: ["book", variables.bookId] });
            queryClient.invalidateQueries({ queryKey: ["book-edit-info", variables.bookId] });
        }
    });
};

export const useUpdateBookQuantity = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ bookId, quantity }: {
            bookId: number,
            quantity: number
        }) => adminBookService.updateBookQuantity(bookId, quantity),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["books"] });
            queryClient.invalidateQueries({ queryKey: ["book", variables.bookId] });
        }
    });
};

export const useDeleteBook = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (bookId: number) => adminBookService.deleteBook(bookId),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["books"] });

        }
    });
};