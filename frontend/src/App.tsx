import Navbar from "./Layouts/NavbarAndFooter/Navbar";
import { Footer } from "./Layouts/NavbarAndFooter/Footer";
import { HomePage } from "./Layouts/HomePage/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SearchBooksPage } from "./Layouts/SearchBooks/SearchBooksPage";

function App() {
    return (
        <>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search" element={<SearchBooksPage />} />
                </Routes>
            </BrowserRouter>

            <Footer />
        </>
    );
}

export default App;
