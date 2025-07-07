import Navbar from "./Layouts/NavbarAndFooter/Navbar";
import { Footer } from "./Layouts/NavbarAndFooter/Footer";
import { HomePage } from "./Layouts/HomePage/HomePage";
import { Route, Routes } from "react-router-dom";
import { SearchBooksPage } from "./Layouts/SearchBooks/SearchBooksPage";
import { BookCheckoutPage } from "./Layouts/BookCheckoutPage/BookCheckoutPage";
import { useNavigate } from "react-router-dom";

import { AuthProvider } from "./Auth/AuthContext";
import LoginPage from "./Layouts/AuthPage/LoginPage";
import SignupPage from "./Layouts/AuthPage/SignupPage";

function App() {
    const navigate = useNavigate();

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="flex-grow-1">
                <AuthProvider>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/" element={<HomePage />} />
                        <Route path="/search" element={<SearchBooksPage />} />
                        <Route
                            path="/checkout/:bookId"
                            element={<BookCheckoutPage />}
                        />
                    </Routes>
                </AuthProvider>
            </div>
            <Footer />
        </div>
    );
}

export default App;
