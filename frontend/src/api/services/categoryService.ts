import { CategoryCreateRequest, CategoryDetails, CategoryReference } from "../../models/CategoryModel";
import { PageParams, PageResponse } from "../../models/PageResponse";
import apiClient from "../client"

export const categoryService = {
    getCategoriesDetails: async (page: number, size: number): Promise<PageResponse<CategoryDetails>> => {
        const params: PageParams = { page: page - 1, size };
        const response = await apiClient.get("/categories/public", { params });
        return {
            content: response.data.content,
            totalPages: response.data.totalPages,
            totalElements: response.data.totalElements
        }
    },

    getCategoriesReferences: async (): Promise<CategoryReference[]> => {
        const response = await apiClient.get(`categories/public/references`);
        return response.data;
    },

    getBookCountByCategory: async (categoryId: number | string): Promise<number> => {
        const response = await apiClient.get(`/categories/public/${categoryId}/books/count`);
        return response.data;
    },

    createCategory: async (newCategory: CategoryCreateRequest): Promise<CategoryDetails> => {
        const response = await apiClient.post("/admin/secure/add/category", newCategory);
        return response.data;
    },

    updateCategory: async (categoryId: number | string, body: CategoryCreateRequest): Promise<CategoryDetails> => {
        const response = await apiClient.put(`/admin/secure/update/category/${categoryId}`, body);
        return response.data;
    },

    deleteCategory: async (categoryId: number | string): Promise<void> => {
        return await apiClient.delete(`/admin/secure/delete/category/${categoryId}`);
    }
}