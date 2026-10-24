import { create } from 'zustand';
import { UserInfo } from '../models/AuthTypes';
import { jwtDecode } from 'jwt-decode';


const SESSION_FLAG_KEY = "has_session";
let refreshTimer: ReturnType<typeof setTimeout> | null = null;
let onProactiveRefresh: (() => void) | null = null;

// Allows client.ts to register the silent refresh callback without circular imports
export function registerProactiveRefresh(callback: () => void) {
    onProactiveRefresh = callback;
}

interface JwtPayload {
    userId: number;
    sub: string;
    role: string;
    exp: number;
}

interface AuthState {
    user: UserInfo | null;
    token: string | null;
    isAdmin: boolean;
    isAuthenticated: boolean;
    isCheckingAuth: boolean;
    setAuth: (token: string) => void;
    clearAuth: () => void;
    setCheckingAuth: (checking: boolean) => void;
}

// check if a token exists and if it is still valid.
export function isTokenValid(token: string | null): boolean {
    if (!token) return false;

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (!decoded.exp) return false;

        const safetyBufferMs = 10000;
        return decoded.exp * 1000 - safetyBufferMs > Date.now();
    } catch {
        return false;
    }
}

function scheduleSilentRefresh(exp: number) {
    if (refreshTimer) clearTimeout(refreshTimer);

    const refreshBufferMs = 60_000; // 1 minute before expiry
    const delayMs = exp * 1000 - Date.now() - refreshBufferMs;

    if (delayMs <= 0) {
        onProactiveRefresh?.();
        return;
    }

    refreshTimer = setTimeout(() => {
        onProactiveRefresh?.();
    }, delayMs);
}

export const useAuthStore = create<AuthState>()((set, get) => ({
    user: null,
    token: null,
    isAdmin: false,
    isAuthenticated: false,
    isCheckingAuth: typeof window !== "undefined" &&
        localStorage.getItem(SESSION_FLAG_KEY) === "true",

    setCheckingAuth: (checking: boolean) => set({ isCheckingAuth: checking }),

    setAuth: (token: string) => {
        try {
            const decoded = jwtDecode<JwtPayload>(token);

            if (!decoded.exp || decoded.exp * 1000 <= Date.now()) {
                get().clearAuth();
                return;
            }

            const user: UserInfo = {
                userId: decoded.userId,
                email: decoded.sub,
                role: decoded.role,
                exp: decoded.exp,
            };

            localStorage.setItem(SESSION_FLAG_KEY, "true");

            set({
                token,
                user,
                isAuthenticated: true,
                isAdmin: user.role === "ADMIN",
                isCheckingAuth: false,
            });

            scheduleSilentRefresh(decoded.exp);
        } catch (error) {
            console.error("Failed to parse incoming token", error);
            get().clearAuth();
        }
    },

    clearAuth: () => {
        if (refreshTimer) {
            clearTimeout(refreshTimer);
            refreshTimer = null;
        }
        localStorage.removeItem(SESSION_FLAG_KEY);
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            isAdmin: false,
            isCheckingAuth: false,
        });
    }
}));

if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
        if (
            event.key === SESSION_FLAG_KEY &&
            event.newValue !== "true"
        ) {
            useAuthStore.getState().clearAuth();
        }
    });
} 