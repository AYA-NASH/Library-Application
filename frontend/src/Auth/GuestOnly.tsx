import { SpinnerLoading } from "@/Layouts/Utils/SpinnerLoading";
import { useAuthStore } from "@/store/useAuthStore"
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const GuestOnly = () => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const isCheckingAuth = useAuthStore((s) => s.isCheckingAuth);

    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const redirectTo = params.get("redirect") ?? "/";

    if (isCheckingAuth) {
        return <SpinnerLoading />;
    }

    if (isAuthenticated) {
        return <Navigate to={redirectTo} replace />
    }

    return <Outlet />
}

export default GuestOnly;