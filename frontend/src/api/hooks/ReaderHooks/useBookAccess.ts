import { useQuery } from "@tanstack/react-query";
import { readerService } from "../../services/readerService";

export const useBookAccess = (bookId: number | string, mode: "full" | "preview") => {
    return useQuery({
        queryKey: ["book-access", bookId, mode],
        queryFn: () =>
            mode === "full"
                ? readerService.getFullAccessUrl(bookId)
                : readerService.getPreviewAccessUrl(bookId),
        enabled: !!bookId,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
};