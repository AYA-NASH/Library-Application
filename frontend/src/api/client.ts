import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { registerProactiveRefresh, useAuthStore } from "../store/useAuthStore";
import { toast } from "sonner";
import { router } from "@/Routes";
import { queryClient } from "./queryClient";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

let refreshPromise: Promise<String | null> | null = null;

export async function refreshSession(): Promise<String | null> {
    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = (async () => {
        try {
            const csrfRes = await apiClient.get<{ token: string }>("/csrf");
            const csrfToken = csrfRes.data.token;

            // Exchange HttpOnly refresh_token cookie for a new access token
            const response = await apiClient.post<{ token: string }>(
                "/refresh",
                {},
                { headers: { "X-XSRF-TOKEN": csrfToken } }
            );
            const newToken = response.data.token;
            useAuthStore.getState().setAuth(newToken);
            return newToken;
        } catch {
            useAuthStore.getState().clearAuth();
            queryClient.clear();
            return null;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

registerProactiveRefresh(() => {
    void refreshSession();
});

apiClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequestConfig | undefined;
        const url = originalRequest?.url ?? "";

        const isAuthEndpoint =
            url.includes("/login") ||
            url.includes("/register") ||
            url.includes("/google-login") ||
            url.includes("/refresh") ||
            url.includes("logout");

        if (error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !isAuthEndpoint
        ) {
            originalRequest._retry = true;

            const newToken = await refreshSession();

            if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return apiClient(originalRequest);
            }

            // Refresh failed: session is truly dead
            if (!window.location.pathname.includes("/login")) {
                toast.error("Your session has expired. Please log in again.");
                const currentPath = window.location.pathname + window.location.search;
                router.navigate(`/login?redirect=${encodeURIComponent(currentPath)}`, {
                    replace: true,
                });
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;