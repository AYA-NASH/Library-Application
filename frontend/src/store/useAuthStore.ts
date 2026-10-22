import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'
import { UserInfo } from '../models/AuthTypes';
import { jwtDecode } from 'jwt-decode';

const STORAGE_KEY = "auth-storage";

let expiryTimer: ReturnType<typeof setTimeout> | null = null;

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
    setAuth: (token: string) => void;
    clearAuth: () => void;
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

// schedule an automatic logout when token reaches 'exp'
function scheduleExpiry(exp: number, onExpire: () => void) {
    if (expiryTimer) clearTimeout(expiryTimer);

    const delayMs = exp * 1000 - Date.now();

    if (delayMs <= 0) {
        onExpire();
        return;
    }

    expiryTimer = setTimeout(() => {
        onExpire();
    }, delayMs);
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isAdmin: false,

            setAuth: (token: string) => {
                try {
                    const decoded = jwtDecode<JwtPayload>(token);

                    // verify token isn't already expired
                    if (!decoded.exp || decoded.exp * 1000 <= Date.now()) {
                        get().clearAuth();
                        return;
                    }

                    const user: UserInfo = {
                        userId: decoded.userId,
                        email: decoded.sub,
                        role: decoded.role,
                        exp: decoded.exp
                    };

                    set({
                        token,
                        user,
                        isAuthenticated: true,
                        isAdmin: user.role === 'ADMIN'
                    });

                    // Schedule proactive logout when exp arrives
                    scheduleExpiry(decoded.exp, () => {
                        get().clearAuth();
                    });

                } catch (error) {
                    console.error("Failed to parse incoming token", error);
                    get().clearAuth();
                }
            },

            clearAuth: () => {
                if (expiryTimer) {
                    clearTimeout(expiryTimer);
                    expiryTimer = null;
                }
                set({ user: null, token: null, isAuthenticated: false, isAdmin: false });
            },

        }),
        {
            name: STORAGE_KEY,
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                if (!state) return;

                // If stored token is missing or expired,
                // wipe the state immediately
                if (!state.token || !isTokenValid(state.token)) {
                    state.clearAuth();
                } else if (state.user?.exp) {
                    // If valid, 
                    // resume the proactive expiry countdown timer
                    scheduleExpiry(state.user.exp, () => {
                        state.clearAuth();
                    });
                }
            }
        }
    )
);

if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
        if (
            event.key === STORAGE_KEY ||
            event.key === null
        ) {
            void useAuthStore.persist.rehydrate();
        }
    });
}