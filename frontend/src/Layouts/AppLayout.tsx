import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "./NavbarAndFooter/Footer";
import Navbar from "./NavbarAndFooter/Navbar";

import "@/styles/bootstrap-scoped.scss";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const AUTH_ROUTES = ["/login", "/signup"];

export default function AppLayout() {
    const location = useLocation();
    const hideNavbar = AUTH_ROUTES.some((path) =>
        location.pathname.startsWith(path)
    );

    return (
        <div className="d-flex flex-column min-vh-100">
            {!hideNavbar && <Navbar key={1} />}

            <main className="grow">
                <Outlet />
            </main>

            {!hideNavbar && <Footer />}
        </div>
    );
}