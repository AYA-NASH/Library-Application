import { AdminBookEditInfoResponse, BookSummaryResponse } from "../../models/Admin";
import apiClient from "../client";

export const adminBookService = {
    addBook: async (book: FormData): Promise<void> => {
        return await apiClient.post(`/admin/secure/add/book`, book);
    },

    fetchEditInfo: async (bookId: number): Promise<AdminBookEditInfoResponse | null> => {
        const response = await apiClient.get(`/admin/secure/book/${bookId}/edit-info`);
        return response.data;
    },
    fetchBookSummary: async (): Promise<BookSummaryResponse> => {
        const response = await apiClient.get(`/admin/secure/books/summary`);
        return response.data;
    },
    updateBook: async (bookId: number, formData: FormData): Promise<void> => {
        return await apiClient.put(`/admin/secure/update/book/data/${bookId}`, formData);
    },

    updateBookQuantity: async (bookId: number, quantity: number): Promise<void> => {
        return await apiClient.put(`/admin/secure/update/book/quantity?bookId=${bookId}&quantity=${quantity}`);
    },

    deleteBook: async (bookId: number): Promise<void> => {
        return await apiClient.delete(`admin/secure/delete/book/${bookId}`);
    }
};