import { useEffect, useState } from "react";
import { CategoryModel } from "../../models/CategoryModel";
import { useAuthStore } from "../../store/useAuthStore";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const useCategories = () => {
    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState<null | string>(null);
    const token = useAuthStore((state) => state.token);
    const fetchCategories = async () => {
        setIsLoading(true);
        const url = `${BASE_URL}/categories`;
        const response = await fetch(url);

        if (!response.ok) throw new Error("Failed to fetch categories");

        const data = await response.json();

        setCategories(data);
        setIsLoading(false);
    };

    const fetchBooksCountByCategory = async (categoryId: number) => {
        const url = `${BASE_URL}/categories/${categoryId}/books/count`;
        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch books count");

        const count = await response.json();
        return count;

    };

    const createCategory = async (name: string) => {
        setHttpError(null);
        const url = `${BASE_URL}/admin/secure/add/category`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to create category");
        }

        return data;
    };

    const updateCategory = async (id: number, name: string) => {
        setHttpError(null);

        const url = `${BASE_URL}/admin/secure/update/category/${id}`;

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Failed to update category");

        return data;
    };

    const deleteCategory = async (id: number) => {
        setHttpError(null);
        const url = `${BASE_URL}/admin/secure/delete/category/${id}`;
        const response = await fetch(url, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Failed to delete category");
        }

        return true;
    }

    useEffect(() => {
        fetchCategories().catch((error) => {
            setIsLoading(false);
            setHttpError(error.message);
        });
    }, []);

    return {
        categories,
        setCategories,
        isLoading,
        setIsLoading,
        httpError,
        setHttpError,
        createCategory,
        updateCategory,
        deleteCategory,
        fetchBooksCountByCategory
    };
};