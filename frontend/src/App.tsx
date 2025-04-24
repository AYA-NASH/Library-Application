import Navbar from "./Layouts/NavbarAndFooter/Navbar";
import { Footer } from "./Layouts/NavbarAndFooter/Footer";
import { HomePage } from "./Layouts/HomePage/HomePage";
import { Route, Routes } from "react-router-dom";
import { SearchBooksPage } from "./Layouts/SearchBooks/SearchBooksPage";
import { BookCheckoutPage } from "./Layouts/BookCheckoutPage/BookCheckoutPage";

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchBooksPage />} />
                <Route
                    path="/checkout/:bookId"
                    element={<BookCheckoutPage />}
                />
            </Routes>

            <Footer />
        </>
    );
}

export default App;
