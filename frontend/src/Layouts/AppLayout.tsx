import { Outlet } from "react-router-dom";
import { Footer } from "./NavbarAndFooter/Footer";
import Navbar from "./NavbarAndFooter/Navbar";

export default function AppLayout() {
    console.log("AppLayout is rendering!"); // Add this
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar key={1}/>

            <main className="grow">
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}