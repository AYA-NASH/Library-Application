import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

export function useReadingProgress(bookId: string) {
    const { token } = useAuth();
    const [lastPage, setLastPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);

    // fetch saved progress - the last page read for the given book
    useEffect(() => {
        if (!bookId || !token) return;

        async function fetchReadingProgress() {
            try {
                const res = await fetch(
                    `${baseUrl}/interactions/secure/book/${bookId}/last-page`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) throw new Error("Failed to load progress");

                const page = await res.json();
                setLastPage(page);

            } catch (error) {
                console.error("Error fetching reading progress:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchReadingProgress();
    }, [bookId, token]);

    // Persist progress when page changes
    useEffect(() => {

        if (!bookId || !token) return;

        async function updateProgress() {
            try {
                await fetch(
                    `${baseUrl}/interactions/secure/book/${bookId}/interact`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ page: lastPage }),
                    }
                );
            } catch (err) {
                console.error(err);
            }
        }

        updateProgress();

    }, [lastPage, bookId, token]);

    return { lastPage, setLastPage, loading };
}