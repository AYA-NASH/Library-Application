import { useState } from "react";
import { AdminBookEditInfoResponse } from "../../models/AdminBookRequest";
import { useAuthStore } from "../../store/useAuthStore";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const useAdminBooks = () => {
    const token = useAuthStore((state)=> state.token);
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchEditInfo = async (bookId: number): Promise<AdminBookEditInfoResponse | null> => {
        try {
            const response = await fetch(`${baseUrl}/admin/secure/book/${bookId}/edit-info`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error();
            return await response.json();
        } catch {
            return null;
        }
    };

    const updateBook = async (bookId: number, formData: FormData) => {
        setIsProcessing(true);
        try {
            const response = await fetch(`${baseUrl}/admin/secure/update/book/data/${bookId}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            if (!response.ok) throw new Error("Update failed");
            return true;
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            setIsProcessing(false);
        }
    };

    return { updateBook, fetchEditInfo, isProcessing };
};