import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { categoryService } from "../../services/categoryService"
import { CategoryCreateRequest } from "../../../models/CategoryModel";

export const useCategories = (page: number, size: number) => {
    return useQuery({
        queryFn: () => categoryService.getCategoriesDetails(page, size),
        queryKey: ["categories", { page, size }]
    });
};

export const useCategoriesReferences = () => {
    return useQuery({
        queryFn: () => categoryService.getCategoriesReferences(),
        queryKey: ["categories-references"]
    });
}

export const useGetBookCountByCategory = (categoryId: number, showDeleteConfirm: boolean) => {
    return useQuery({
        queryFn: () => categoryService.getBookCountByCategory(categoryId),
        queryKey: ["books-count-in-category", categoryId],
        enabled: !!categoryId && showDeleteConfirm,
    });
};

export const useCategorySummary = () => {
    return useQuery({
        queryFn: () => categoryService.getCategorySummary(),
        queryKey: ["categories-summary"],
        staleTime: 5 * 60 * 1000,
    })
}

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newCategory: CategoryCreateRequest) => categoryService.createCategory(newCategory),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        }
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            categoryId,
            requestBody
        }: {
            categoryId: number | string;
            requestBody: CategoryCreateRequest;
        }) => categoryService.updateCategory(categoryId, requestBody),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        }
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (categoryId: number | string) => categoryService.deleteCategory(categoryId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
        }
    })
}