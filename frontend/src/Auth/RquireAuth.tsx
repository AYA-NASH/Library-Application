import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { SpinnerLoading } from "@/Layouts/Utils/SpinnerLoading";

const RequireAuth = ({ role }: { role?: string }) => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const isAdmin = useAuthStore((s) => s.isAdmin);
    const isCheckingAuth = useAuthStore((s) => s.isCheckingAuth);

    const location = useLocation();

    // Wait for silent cookie refresh on page reload before deciding to redirect
    if (isCheckingAuth) {
        return <SpinnerLoading />;
    }

    if (!isAuthenticated) return <Navigate to={"/login"} state={{ from: location }} replace />

    if (role === "ADMIN" && !isAdmin) return <Navigate to="/" replace />;

    return <Outlet />;
};

export default RequireAuth;