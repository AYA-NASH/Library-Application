import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "sonner";
import { router } from "@/Routes";
import { queryClient } from "./queryClient";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,

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
    (error) => {
        const { clearAuth, isAuthenticated } = useAuthStore.getState();

        if (error.response?.status === 401 && !window.location.pathname.includes("/login")) {

            if (isAuthenticated) {
                clearAuth();
                queryClient.clear();
                toast.error("Your session has expired. Please log in again.");
                // save the current location as a query param
                const currentPath = window.location.pathname + window.location.search;
                router.navigate(`/login?redirect=${encodeURIComponent(currentPath)}`, { replace: true })
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;