import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const RequireAuth = ({ role }: { role?: string }) => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const isAdmin = useAuthStore((s) => s.isAdmin);
    const location = useLocation();

    if (!isAuthenticated()) return <Navigate to={"/login"} state={{ from: location }} replace />

    if (role === "ADMIN" && !isAdmin()) return <Navigate to="/" replace />;

    return <Outlet />;
};

export default RequireAuth;