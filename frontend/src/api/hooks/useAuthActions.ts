import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { LoginResponse } from "../../models/AuthTypes";
import { toast } from 'sonner';

export const useAuthActions = () => {
    const setAuth = useAuthStore((state) => state.setAuth);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const queryClient = useQueryClient();

    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const from =
        (location.state as { from?: Location })?.from?.pathname
        ?? params.get("redirect")
        ?? "/";

    const loginMutation = useMutation({
        mutationFn: authService.login,
        onSuccess: (data: LoginResponse) => {
            setAuth(data.token);
            toast.success(`Welcome back, ${data.user.email}!`);
            navigate(from, { replace: true });
        }
    });

    const registerMutation = useMutation({
        mutationFn: authService.register,
        onSuccess: () => {
            toast.success("Account created! Please login.");
            navigate("/login");
        }
    });

    const googleLoginMutation = useMutation({
        mutationFn: authService.loginWithGoogle,
        onSuccess: (data) => {
            setAuth(data.token);
            toast.success(`Welcome back, ${data.user.email}!`);
            navigate(from, { replace: true });
        }
    });

    const logout = async () => {
        try {
            await authService.logout();
        } catch {

        } finally {
            clearAuth();
            queryClient.clear();
            toast.info("You have been logged out.");
            navigate("/login", { replace: true });
        }
    };

    return {
        login: loginMutation.mutateAsync,
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,

        register: registerMutation.mutateAsync,
        isRegistering: registerMutation.isPending,
        registerError: registerMutation.error,

        googleLogin: googleLoginMutation.mutateAsync,
        isGoogleLoggingIn: googleLoginMutation.isPending,

        logout
    };
};