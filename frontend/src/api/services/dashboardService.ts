import {
    InventorySummary,
    PhysicalDigitalReads,
    RecentActivityLog,
    SummaryCardItem,
    TopBook,
    TopCategoriesTrends
} from "@/models/MainDashboard";
import { fetchEventSource } from '@microsoft/fetch-event-source';
import apiClient from "../client"

const url = "/admin/secure/dashboard/main";

export const dashboardService = {
    getSummary: async (): Promise<SummaryCardItem> => {
        return await apiClient.get(`${url}/metrics`);
    },

    getPhysicalDigitalActivities: async (days?: number): Promise<PhysicalDigitalReads[]> => {
        return await apiClient.get(`${url}/physical-digital-activity${days ? `?days=${days}` : ""}`);
    },

    getCategoriesTrends: async (days?: number): Promise<TopCategoriesTrends[]> => {
        return await apiClient.get(`${url}/category-trends${days ? `?days=${days}` : ""}`);
    },

    getInventorySummary: async (lowStockThreshold?: number): Promise<InventorySummary> => {
        return await apiClient.get(`${url}/inventory-summary${lowStockThreshold ? `?lowStockThreshold=${lowStockThreshold}` : ""}`);
    },

    getTopBooks: async (days?: number): Promise<TopBook[]> => {
        return await apiClient.get(`${url}/top-books${days ? `?days=${days}` : ""}`);
    },

    getHistoricalActivities: async (): Promise<RecentActivityLog[]> => {
        return await apiClient.get(`${url}/activity-history`);
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