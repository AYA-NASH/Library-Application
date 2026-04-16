import apiClient from "../client";
import { BookModel } from "../../models/BookModel";

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
}

export const bookService = {
    getBooks: async (page: number, size: number, text?: string, categoryId?: number): Promise<PageResponse<BookModel>> => {
        let url = "/books/all";
        const params: any = { page: page - 1, size };

        if (text) {
            url = "/books/search/findByTitleContaining";
            params.title = text;
        } else if (categoryId) {
            url = "/books/search/findByCategoryId";
            params.categoryId = categoryId;
        }

        const response = await apiClient.get(url, { params });

        const transformedContent = response.data.content.map((b: any) => ({
            id: b.id,
            title: b.title,
            author: b.author,
            description: b.description,
            copies: b.copies,
            copiesAvailable: b.copiesAvailable,
            categories: b.categories,
            img: b.imgUrl,
            dataSource: b.dataSource
        }));

        return {
            content: transformedContent,
            totalPages: response.data.page.totalPages,
            totalElements: response.data.page.totalElements
        };
    },

    getBookById: async (bookId: string | number): Promise<BookModel> => {
        const response = await apiClient.get(`/books/${bookId}`);
        const b = response.data;

        return {
            id: b.id,
            title: b.title,
            author: b.author,
            description: b.description,
            categories: b.categories,
            dataSource: b.dataSource,
            img: b.imgUrl,
        };
    },

}