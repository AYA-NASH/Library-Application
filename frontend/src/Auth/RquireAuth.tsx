import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { JSX } from "react";

const RequireAuth = ({ children, role }: { children: JSX.Element, role?: string }) => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const isAdmin = useAuthStore((s) => s.isAdmin);
    const location = useLocation();

    if (!isAuthenticated()) return <Navigate to={"/login"} state={{ from: location }} replace />

    if (role === "ADMIN" && !isAdmin()) return <Navigate to="/" replace />;

    return children;
};

export default RequireAuth;