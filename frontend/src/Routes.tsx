import { createBrowserRouter } from "react-router-dom";

import AppLayout from "./Layouts/AppLayout";
import { HomePage } from "./Layouts/HomePage/HomePage";
import LoginPage from "./Layouts/AuthPage/LoginPage";
import RequireAuth from "./Auth/RquireAuth";
import { ShelfPage } from "./Layouts/ShelfPage/ShelfPage";
import { MessagesPage } from "./Layouts/MessagesPage/MessagesPage";
import { PaymentPage } from "./Layouts/PaymentPage/PaymentPage";
import { ManageLibraryPage } from "./Layouts/ManageLibraryPage/ManageLibraryPage";
import SignupPage from "./Layouts/AuthPage/SignupPage";
import { BookCheckoutPage } from "./Layouts/BookCheckoutPage/BookCheckoutPage";
import { ReviewListPage } from "./Layouts/BookCheckoutPage/ReviewListPage/ReviewListPage";
import { SearchBooksPage } from "./Layouts/SearchBooks/SearchBooksPage";
import { ReaderPreviewPage } from "./Layouts/PDFReader/ReaderPreviewPage";
import { ReaderAccessPage } from "./Layouts/PDFReader/ReaderAccessPage";
import { ReaderPage } from "./Layouts/PDFReader/ReaderPage";
import { NotFoundPage } from "./Layouts/Utils/NotFoundPage";
import { GlobalErrorFallback } from "./Layouts/Utils/GlobalErrorFallback";
import { ErrorBoundary } from "react-error-boundary";
import { DashboardLayout } from "./Layouts/AdminDashboard/DashboardLayout";
import { MainPage } from "./Layouts/AdminDashboard/pages/MainPage";
import { Books } from "./Layouts/AdminDashboard/pages/Books";
import { RecentLoans } from "./Layouts/AdminDashboard/pages/RecentLoans";
import { Messages } from "./Layouts/AdminDashboard/pages/Messages";
import { Categories } from "./Layouts/AdminDashboard/pages/Categories";

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ErrorBoundary
                FallbackComponent={GlobalErrorFallback}
                onReset={() => window.location.replace("/")}
            >
                <AppLayout />
            </ErrorBoundary>
        ),
        children: [
            { index: true, element: <HomePage /> },
            { path: "login", element: <LoginPage /> },
            { path: "signup", element: <SignupPage /> },
            { path: "search", element: <SearchBooksPage /> },
            { path: "checkout/:bookId", element: <BookCheckoutPage /> },
            { path: "reviewList/:bookId", element: <ReviewListPage /> },

            {
                element: <RequireAuth />,
                children: [
                    { path: "shelf", element: <ShelfPage /> },
                    { path: "messages", element: <MessagesPage /> },
                    { path: "fees", element: <PaymentPage /> },

                    { path: "reader/:bookId/preview", element: <ReaderPreviewPage /> },
                    { path: "reader/:bookId", element: <ReaderAccessPage /> },
                    { path: "reader/:bookId/read", element: <ReaderPage /> }

                ]
            },
            {
                element: <RequireAuth role="ADMIN" />,
                children: [
                    { path: "admin", element: <ManageLibraryPage /> },

                ]
            },
            { path: "*", element: <NotFoundPage /> },

        ]
    },
    {
        path: "admin-dashboard",
        element: <DashboardLayout />,
        children: [
            { index: true, element: <MainPage /> },
            { path: "books", element: <Books /> },
            {path: "categories", element: <Categories />},
            { path: "recent-loans", element: <RecentLoans /> },
            { path: "messages", element: <Messages /> },
        ]
    },
]);