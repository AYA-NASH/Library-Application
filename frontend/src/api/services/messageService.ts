import { AdminMessageView, AdminReplyRequest, MessageResponse, userCreateMessageRequest } from "../../models/MessageModel";
import { PageParams, PageResponse } from "../../models/PageResponse";
import apiClient from "../client";

export const messageService = {
    // -------- USER --------------
    getUserMessges: async (page: number, size: number): Promise<PageResponse<MessageResponse>> => {
        const params: PageParams = { page: page - 1, size };
        const response = await apiClient.get("/messages/mine", { params });
        return {
            content: response.data.content,
            totalPages: response.data.page.totalPages,
            totalElements: response.data.page.totalElements
        }
    },

    userAddMessage: async (request: userCreateMessageRequest): Promise<void> => {
        return await apiClient.post("/messages/secure/add/message", request);
    },

    // ------- ADMIN --------------
    getAdminOpenedMessages: async (page: number, size: number): Promise<PageResponse<AdminMessageView>> => {
        const params: PageParams = { page: page - 1, size };
        const response = await apiClient.get("/messages/admin/open", { params });
        return {
            content: response.data.content,
            totalPages: response.data.page.totalPages,
            totalElements: response.data.page.totalElements
        };
    },

    adminReply: async (request: AdminReplyRequest): Promise<void> => {
        return await apiClient.put("/messages/secure/admin/reply", request);
    }
}