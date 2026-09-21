import {
    InventorySummary,
    MainSummaryMetrics,
    PhysicalDigitalReads,
    RecentActivityLog,
    TopBook,
    TopCategoriesTrends
} from "@/models/MainDashboard";
import { fetchEventSource } from '@microsoft/fetch-event-source';
import apiClient from "../client"

const url = "/admin/secure/dashboard/main";

export const dashboardService = {
    getSummary: async (): Promise<MainSummaryMetrics> => {
        return (await apiClient.get(`${url}/metrics`)).data;
    },

    getPhysicalDigitalActivities: async (days?: number): Promise<PhysicalDigitalReads[]> => {
        return (await apiClient.get(`${url}/physical-digital-activity${days ? `?days=${days}` : ""}`)).data;
    },

    getCategoriesTrends: async (days?: number): Promise<TopCategoriesTrends[]> => {
        return (await apiClient.get(`${url}/category-trends${days ? `?days=${days}` : ""}`)).data;
    },

    getInventorySummary: async (lowStockThreshold?: number): Promise<InventorySummary> => {
        return (await apiClient.get(`${url}/inventory-summary${lowStockThreshold ? `?lowStockThreshold=${lowStockThreshold}` : ""}`)).data;
    },

    getTopBooks: async (days?: number): Promise<TopBook[]> => {
        return (await apiClient.get(`${url}/top-books${days ? `?days=${days}` : ""}`)).data;
    },

    getHistoricalActivities: async (): Promise<RecentActivityLog[]> => {
        return (await apiClient.get(`${url}/activity-history`)).data;
    },

    subscribeToActivityStream: (
        token: string,
        onMessage: (activity: RecentActivityLog) => void,
        onError?: (error: any) => void
    ) => {
        const abortController = new AbortController();

        const connectionUrl = `${import.meta.env.VITE_API_BASE_URL}${url}/activity-stream`;

        fetchEventSource(connectionUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'text/event-stream',
            },
            signal: abortController.signal,
            openWhenHidden: true,
            onmessage(event) {
                if (event.event === 'activity-event') {
                    const parsedData: RecentActivityLog = JSON.parse(event.data);
                    onMessage(parsedData);
                }
            },

            onerror(err) {
                if (onError) onError(err);
                throw err;
            }
        });

        return () => abortController.abort();
    }
}