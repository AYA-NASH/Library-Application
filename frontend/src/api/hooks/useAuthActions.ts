import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { LoginResponse } from "../../models/AuthTypes";
import { toast } from 'sonner';

export const useAuthActions = () => {
    const setAuth = useAuthStore((state) => state.setAuth);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const navigate = useNavigate();

    const loginMutation = useMutation({
        mutationFn: authService.login,
        onSuccess: (data: LoginResponse) => {
            setAuth(data.user, data.token);
            toast.success(`Welcome back, ${data.user.username}!`);
            navigate("/");
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
            setAuth(data.user, data.token);
            toast.success(`Welcome back, ${data.user.username}!`);
            navigate("/");
        }
    });

    const logout = () => {
        clearAuth();
        toast.info("You have been logged out.");
        navigate("/login");
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