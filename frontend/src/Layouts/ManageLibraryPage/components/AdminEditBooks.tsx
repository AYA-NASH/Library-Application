import { useState } from "react";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { EditBook } from "./EditBook";
import { useBooks } from "../../../Hooks/useBooks";
import { BookFilterBar } from "../../Utils/BookFilterBar";

export const AdminEditBooks = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams, setSearchParams] = useState<{ text?: string; category?: string }>();
    const [bookDelete, setBookDelete] = useState(false);
    const [bookUpdate, setBookUpdate] = useState(false);

    const booksPerPage = 5;
    const categories = ["All", "BE", "FE", "Data", "DevOps"];

    const { books, isLoading, httpError, totalPages, totalElements } =
        useBooks(currentPage, booksPerPage, searchParams);

    const handleSearch = (params: { text?: string; category?: string }) => {
        setCurrentPage(1);
        setSearchParams(params);
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const deleteBook = () => setBookDelete(!bookDelete);
    const updateBook = () => setBookUpdate(!bookUpdate);

    if (isLoading) return <SpinnerLoading />;
    if (httpError)
        return (
            <div className="container">
                <p>{httpError}</p>
            </div>
        );

    return (
        <div className="container mt-3">
            <BookFilterBar
                categories={categories}
                initialCategory="All"
                onSearch={handleSearch}
            />

            {totalElements > 0 ? (
                <>
                    <div className="mt-3">
                        <h3>Number of results: ({totalElements})</h3>
                    </div>

                    <p>
                        {currentPage * booksPerPage - booksPerPage + 1} to{" "}
                        {currentPage * booksPerPage <= totalElements
                            ? currentPage * booksPerPage
                            : totalElements}{" "}
                        of {totalElements} items:
                    </p>

                    {books.map((book) => (
                        <EditBook
                            book={book}
                            key={book.id}
                            deleteBook={deleteBook}
                            updateBook={updateBook}
                        />
                    ))}
                </>
            ) : (
                <p>Add a book before changing the quantity</p>
            )}

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    paginate={paginate}
                />
            )}
        </div>
    );
};
