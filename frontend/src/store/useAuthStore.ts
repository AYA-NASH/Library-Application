import { create } from 'zustand';
import { UserInfo } from '../models/AuthTypes';


interface AuthState {
    user: UserInfo | null;
    token: string | null;
    isAdmin: () => boolean;
    isAuthenticated: () => boolean;
    setAuth: (user: UserInfo, token: string) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    // Initialize from localStorage immediately
    user: JSON.parse(localStorage.getItem("user") || "null"),
    token: localStorage.getItem("token"),

    isAdmin: () => get().user?.role === 'ADMIN',
    isAuthenticated: () => !!get().token,

    setAuth: (user, token) => {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        set({ user, token });
    },

    clearAuth: () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        set({ user: null, token: null });
    },
}))