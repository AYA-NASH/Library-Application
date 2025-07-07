import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = async (email: string, password: string) => {
        const user = { email, password };
        console.log("User: ", user);
        const url = baseUrl + "/login";
        console.log(url);
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(user),
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            console.log("jsonResponse: ", jsonResponse);

            setUser(user);
            localStorage.setItem("user", JSON.stringify(jsonResponse.user));
            localStorage.setItem("token", jsonResponse.token);
        } else {
            throw new Error("Invalid credentials");
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
