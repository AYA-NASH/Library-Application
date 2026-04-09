import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth";
import { useAuth as useGlobalAuth } from "../../Auth/AuthContext"; 
import { useNavigate } from "react-router-dom";

export const useAuthActions = () => {
    const { setUser, setToken } = useGlobalAuth();
    const navigate = useNavigate();

    const loginMutation = useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setToken(data.token);
            setUser(data.user);
            navigate("/"); 
        }
    });

    const registerMutation = useMutation({
        mutationFn: authService.register,
        onSuccess: () => {
            navigate("/login", { state: { message: "Account created! Please login." } });
        }
    });

    const googleLoginMutation = useMutation({
        mutationFn: authService.loginWithGoogle,
        onSuccess: (data) => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setToken(data.token);
            setUser(data.user);
            navigate("/");
        }
    });

    return {
        login: loginMutation.mutateAsync,
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,

        register: registerMutation.mutateAsync,
        isRegistering: registerMutation.isPending,
        registerError: registerMutation.error,

        googleLogin: googleLoginMutation.mutateAsync,
        isGoogleLoggingIn: googleLoginMutation.isPending
    };
};