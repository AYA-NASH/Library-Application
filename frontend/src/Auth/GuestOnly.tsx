import { useAuthStore } from "@/store/useAuthStore"
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const GuestOnly = () => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const redirectTo = params.get("redirect") ?? "/";

    if (isAuthenticated) {
        return <Navigate to={redirectTo} replace />
    }

    return <Outlet />
}

export default GuestOnly;