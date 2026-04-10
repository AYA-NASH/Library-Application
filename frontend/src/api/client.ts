import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "sonner";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
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

            if (isAuthenticated()) {
                clearAuth();
                toast.error("Your session has expired. Please log in again.");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;