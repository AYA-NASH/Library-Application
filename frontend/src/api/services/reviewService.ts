import apiClient from "../client";
import { ReviewModel, ReviewRequest } from "../../models/ReviewModel";
import { PageResponse } from "../../models/PageResponse";

export const reviewService = {
    getBookReviews: async (bookId: number | string, page: number, size: number): Promise<PageResponse<ReviewModel>> => {
        const url = `/reviews/public/book/${bookId}`;
        const params: any = { page: page - 1, size };
        const response = await apiClient.get(url, { params });

        return {
            content: response.data.content,
            totalPages: response.data.page.totalPages,
            totalElements: response.data.page.totalElements
        }
    },

    getIsBookReviewedByUser: async (bookId: number | string): Promise<boolean> => {
        const response = await apiClient.get(`/reviews/secure/user/${bookId}`);
        return response.data;
    },

    submitReview: async (reviewRequest: ReviewRequest, bookId: number | string): Promise<void> => {
        await apiClient.post(`/reviews/secure/user/book/${bookId}`, reviewRequest);
    }
};
