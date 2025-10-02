import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { JSX } from "react";

const RequireAuth = ({ children, role }: { children: JSX.Element, role?: string }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (role && user.role !== role) {
        return <Navigate to="/" replace />;  // redirect non-admins back to home
    }
    
    return children;
};

export default RequireAuth;
