import apiClient from "../client";
import { PageResponse } from "../../models/PageResponse";
import { ShelfCurrentLoans } from "../../models/ShelfCurrentLoans";

export const loanService = {
    getCurrentLoans: async (page: number, size: number): Promise<PageResponse<ShelfCurrentLoans>> => {
        const params: any = { page: page - 1, size };

        const response = await apiClient.get("/books/secure/current-loans", { params })

        const transformedContent: ShelfCurrentLoans[] = response.data.content.map((loan: any) => ({
            book: {
                id: loan.bookId,
                title: loan.title,
                author: loan.author,
                img: loan.img,
                description: loan.description,
                // categories: [],
            },
            daysLeft: loan.daysLeft
        }));

        return {
            content: transformedContent,
            totalPages: response.data.page.totalPages,
            totalElements: response.data.page.totalElements
        };
    },

    getCurrentLoansCount: async (): Promise<number> => {
        const response = await apiClient.get("/books/secure/current-loans/count");
        return response.data
    },

    getIsBookCheckedoutByUser: async (bookId: string | number): Promise<boolean> => {
        const params = { bookId: bookId }
        const response = await apiClient.get("/books/secure/is-checked-out/byuser", { params });
        return response.data
    },

    checkout: async (bookId: number | string): Promise<ShelfCurrentLoans> => {
        const response = await apiClient.put("/books/secure/checkout", null, {
            params: { bookId }
        });
        return response.data;
    },

    returnBook: async (bookId: number | string): Promise<void> => {
        await apiClient.put("/books/secure/return", null, { params: { bookId } });
    },

    renewLoan: async (bookId: number | string): Promise<void> => {
        await apiClient.put("/books/secure/renew/loan", null, { params: { bookId } });
    }
}