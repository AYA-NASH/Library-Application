import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { readerService } from "../../services/readerService";

export const useReadingProgress = (bookId: number | undefined) => {
    const queryClient = useQueryClient();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const { data: lastPage = 1, isLoading } = useQuery({
        queryKey: ["reading-progress", bookId],
        queryFn: () => readerService.fetchUserReadingProgress(bookId!),
        enabled: !!bookId,
    });

    const { mutate: saveProgress } = useMutation({
        mutationFn: (page: number) => readerService.saveUserReadingProgress(bookId!, page),
        onSuccess: (_, page) => {
            queryClient.setQueryData(["reading-progress", bookId], page);
        }
    });

    const syncProgress = (page: number) => {
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            saveProgress(page);
        }, 2000); // Wait 2 seconds of inactivity before saving
    };

    return { lastPage, isLoading, syncProgress };
};