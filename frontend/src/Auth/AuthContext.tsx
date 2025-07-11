import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { setAutoLogout } from "./SetAutoLogout";

interface AuthContextType {
    user: any;
    login: (email: string, password: string) => Promise<void>;
    logout: (message?: string | null) => void;
    alertMessage: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setAutoLogout(token, logout);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const user = { email, password };
        const url = baseUrl + "/login";

        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(user),
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            const jsonResponse = await response.json();

            setUser(user);
            localStorage.setItem("user", JSON.stringify(jsonResponse.user));
            localStorage.setItem("token", jsonResponse.token);

            setAutoLogout(jsonResponse.token, logout);
        } else {
            throw new Error("Invalid credentials");
        }
    };

    const logout = (message: string | null = null) => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        if (message) {
            setAlertMessage(message);
            setTimeout(() => setAlertMessage(null), 3000);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, alertMessage }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};