import { HistoryModel } from "../../models/HistoryModel";
import { PageParams } from "../../models/PageResponse";
import apiClient from "../client";
import { PageResponse } from "./bookService";

export const historyService = {
    getUserBooksHistory: async (page: number, size: number): Promise<PageResponse<HistoryModel>> => {
        const params: PageParams = { page: page - 1, size: size };
        const response = await apiClient.get("/history/user", { params });

        return {
            content: response.data.content,
            totalElements: response.data.page.totalElements,
            totalPages: response.data.page.totalPages
        }
    }
}