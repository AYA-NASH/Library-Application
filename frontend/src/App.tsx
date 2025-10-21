import Navbar from "./Layouts/NavbarAndFooter/Navbar";
import { Footer } from "./Layouts/NavbarAndFooter/Footer";
import { HomePage } from "./Layouts/HomePage/HomePage";
import { Route, Routes } from "react-router-dom";
import { SearchBooksPage } from "./Layouts/SearchBooks/SearchBooksPage";
import { BookCheckoutPage } from "./Layouts/BookCheckoutPage/BookCheckoutPage";

import { AuthProvider, useAuth } from "./Auth/AuthContext";
import LoginPage from "./Layouts/AuthPage/LoginPage";
import SignupPage from "./Layouts/AuthPage/SignupPage";
import { ReviewListPage } from "./Layouts/BookCheckoutPage/ReviewListPage/ReviewListPage";
import RequireAuth from "./Auth/RquireAuth";
import { ShelfPage } from "./Layouts/ShelfPage/ShelfPage";
import { MessagesPage } from "./Layouts/MessagesPage/MessagesPage";
import { ManageLibraryPage } from "./Layouts/ManageLibraryPage/ManageLibraryPage";
import { PaymentPage } from "./Layouts/PaymentPage/PaymentPage";

function App() {
    return (
        <AuthProvider>
            <InnerApp />
        </AuthProvider>
    );
}

function InnerApp() {
    const { alertMessage } = useAuth();

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            {alertMessage && (
                <div
                    className="alert alert-warning text-center m-0 rounded-0"
                    role="alert"
                >
                    {alertMessage}
                </div>
            )}
            <div className="flex-grow-1">
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search" element={<SearchBooksPage />} />
                    <Route
                        path="/checkout/:bookId"
                        element={<BookCheckoutPage />}
                    />
                    <Route
                        path="/reviewList/:bookId"
                        element={<ReviewListPage />}
                    />
                    <Route
                        path="/shelf"
                        element={
                            <RequireAuth>
                                <ShelfPage />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/messages"
                        element={
                            <RequireAuth>
                                <MessagesPage />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <RequireAuth role="ADMIN">
                                <ManageLibraryPage />
                            </RequireAuth>
                        }
                    />

                    <Route
                        path="/fees"
                        element={
                            <RequireAuth>
                                <PaymentPage />
                            </RequireAuth>
                        }
                    />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}

export default App;
