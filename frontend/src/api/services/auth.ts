import apiClient from "../client";
import { LoginRequest, LoginResponse, SignupRequest } from "../../models/AuthTypes";

export const authService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>("/login", credentials);
        return response.data;
    },
    register: async (userData: SignupRequest): Promise<void> => {
        await apiClient.post("/register", userData);
    },
    loginWithGoogle: async (token: string): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>("/google-login", { token });
        return response.data;
    },

    // Fetches CSRF token (sets XSRF-TOKEN cookie + returns token value)
    getCsrfToken: async (): Promise<string> => {
        const response = await apiClient.get<{ token: string }>("/csrf");
        return response.data.token;
    },

    //  Rotates the HttpOnly refresh_token cookie and returns a fresh 15m access token
    refresh: async (): Promise<LoginResponse> => {
        const csrfToken = await authService.getCsrfToken();
        const response = await apiClient.post<LoginResponse>(
            "/refresh",
            {},
            {
                headers: { "X-XSRF-TOKEN": csrfToken }
            }
        );

        return response.data;
    },

    //  Revokes the refresh token in DB and clears the HttpOnly cookie
    logout: async (): Promise<void> => {
        const csrfToken = await authService.getCsrfToken();
        await apiClient.post(
            "/logout",
            {},
            {
                headers: { "X-XSRF-TOKEN": csrfToken }
            }
        );
    }
}
