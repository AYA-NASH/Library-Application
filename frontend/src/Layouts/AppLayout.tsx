import { Outlet } from "react-router-dom";
import { Footer } from "./NavbarAndFooter/Footer";
import Navbar from "./NavbarAndFooter/Navbar";

import "@/styles/bootstrap-scoped.scss"
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function AppLayout() {
    return (
        <div className="bootstrap-scope">
            <div className="d-flex flex-column min-vh-100">
                <Navbar key={1} />

                <main className="grow">
                    <Outlet />
                </main>

                <Footer />
            </div>
        </div>
    )
}