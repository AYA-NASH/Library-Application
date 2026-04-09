import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { setAutoLogout } from "./SetAutoLogout";

interface AuthContextType {
    user: any;
    token: string | null;
    setUser: (user: any) => void;
    setToken: (token: string | null) => void;
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("token");
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setAutoLogout(token, logout);
        }
    }, []);


    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, setUser, setToken, logout }}>
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