import { useQuery } from "@tanstack/react-query"
import { historyService } from "../../services/historyService"

export const useGetUserBooksHistory = (page: number, size: number) => {
    return useQuery({
        queryFn: () => historyService.getUserBooksHistory(page, size),
        queryKey: ["user-history", { page, size }]
    })
}