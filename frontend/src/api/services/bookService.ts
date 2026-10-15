import apiClient from "../client";
import { BookModel } from "../../models/BookModel";

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
}

export const bookService = {
    getBooks: async (
        page: number,
        size: number,
        text?: string,
        categoryId?: number,
        status?: string,
        dataSource?: string
    ): Promise<PageResponse<BookModel>> => {
        let url = "/books/public/all";
        const params: any = { page: page - 1, size };

        if (text) {
            params.text = text;
        }
        if (categoryId) {
            params.categoryId = categoryId;
        }
        if (status && status !== "all") {
            params.status = status;
        }
        if (dataSource && dataSource !== "all") {
            params.dataSource = dataSource;
        }

        const response = await apiClient.get(url, { params });

        const content = response.data?.content ?? [];
        const transformedContent = content.map((b: any) => ({
            id: b.id,
            title: b.title,
            author: b.author,
            description: b.description,
            copies: b.copies,
            copiesAvailable: b.copiesAvailable,
            categories: b.categories,
            img: b.imgUrl,
            dataSource: b.dataSource,
            status: b.status,
            averageRating: b.averageRating ?? null
        }));
        return {
            content: transformedContent,
            totalPages: response.data.page?.totalPages ?? response.data.totalPages ?? 0,
            totalElements: response.data.page?.totalElements ?? response.data.totalElements ?? 0
        };
    },

    getBookById: async (bookId: string | number): Promise<BookModel> => {
        const response = await apiClient.get(`/books/public/${bookId}`);
        const b = response.data;

        return {
            id: b.id,
            title: b.title,
            status: b.status,
            author: b.author,
            description: b.description,
            copies: b.copies,
            copiesAvailable: b.copiesAvailable,
            categories: b.categories,
            dataSource: b.dataSource,
            img: b.imgUrl,
            averageRating: b.averageRating ?? null
        };
    },

}