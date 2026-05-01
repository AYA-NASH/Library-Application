import { DigitalAccessResponse } from "../../models/reader";
import apiClient from "../client";

export const readerService = {
    getFullAccessUrl: async (bookId: number|string): Promise<DigitalAccessResponse> => {
        const response = await apiClient.get(`/reading/secure/${bookId}/full`);
        return response.data;
    },

    getPreviewAccessUrl: async (bookId: number|string): Promise<DigitalAccessResponse> => {
        const response = await apiClient.get(`/reading/public/${bookId}/preview`);
        return response.data;
    },

    fetchUserReadingProgress: async (bookId: number|string): Promise<number> => {
        const response = await apiClient.get(`/interactions/secure/book/${bookId}/last-page`);
        return response.data;
    },

    saveUserReadingProgress: async (bookId: number|string, page: number): Promise<void> => {
        return apiClient.put(`/interactions/secure/book/${bookId}/interact`, { page });
    }
}