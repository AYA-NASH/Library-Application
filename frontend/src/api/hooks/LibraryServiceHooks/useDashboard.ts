import { dashboardService } from "@/api/services/dashboardService"
import { RecentActivityLog } from "@/models/MainDashboard";
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react";

export const useMainSummary = () => {
    return useQuery({
        queryKey: ["main-summary-metrics"],
        queryFn: () => dashboardService.getSummary()
    });
}

export const usePhysicalDigitalActivities = (days?: number) => {
    return useQuery({
        queryKey: ["physical-digital-activity", days],
        queryFn: () => dashboardService.getPhysicalDigitalActivities(days),
    });
}

export const useCategoriesTrends = (days?: number) => {
    return useQuery({
        queryKey: ["category-trends", days],
        queryFn: () => dashboardService.getCategoriesTrends(days)
    });
}

export const useInventorySummary = (lowStock?: number) => {
    return useQuery({
        queryKey: ["inventory-summary", lowStock],
        queryFn: () => dashboardService.getInventorySummary(lowStock)
    })
}

export const useTopBooks = (days?: number) => {
    return useQuery({
        queryKey: ["top-books", days],
        queryFn: () => dashboardService.getTopBooks(days)
    })
}

export const useActivityFeed = (token: string) => {
    const queryClient = useQueryClient();
    const queryKey = ["recent-activities-log"];

    const { data: activities, isLoading, isError } = useQuery({
        queryKey: queryKey,
        queryFn: () => dashboardService.getHistoricalActivities(),
        staleTime: Infinity,
    });

    useEffect(() => {
        if (!token) return;

        const unsubscribe = dashboardService.subscribeToActivityStream(
            token,
            (newActivity) => {
                // React Query Injection
                queryClient.setQueryData<RecentActivityLog[]>(queryKey, (oldData) => {
                    const currentList = oldData || [];
                    return [newActivity, ...currentList].slice(0, 50);
                });
            },
            (error) => console.error("SSE Connection Error:", error)
        );

        // Clean up the connection when the admin leaves the page
        return () => unsubscribe();
    }, [token, queryClient]);

    return {
        activities: activities || [],
        isLoading,
        isError
    };
}
