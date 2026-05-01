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
}
