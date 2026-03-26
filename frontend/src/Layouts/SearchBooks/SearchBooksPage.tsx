import { useMemo, useState } from "react";
import { Pagination } from "../Utils/Pagination";
import { SearchBooks } from "./SearchBooks";
import { useBooks } from "../../Hooks/BookHooks/useBooks";
import { BookFilterBar } from "../Utils/BookFilterBar";
import { useCategories } from "../../Hooks/BookHooks/useCategories";

type SearchParams = {
    text?: string;
    categoryId?: number;
};

export const SearchBooksPage = () => {
    const { categories } = useCategories();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams, setSearchParams] = useState<SearchParams>();

    const booksPerPage = 5;

    const options = useMemo(() =>
        categories.map(cat => ({ value: cat.id, label: cat.name })),
        [categories]);

    const { books, isLoading, httpError, totalPages, totalElements } =
        useBooks(currentPage, booksPerPage, searchParams);

    const handleSearch = (params: SearchParams) => {
        setCurrentPage(1);
        setSearchParams(params);
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    if (isLoading) return <div>Loading...</div>;
    if (httpError) return <div>{httpError}</div>;

    const lastItem =
        currentPage * booksPerPage <= totalElements
            ? currentPage * booksPerPage
            : totalElements;

    return (
        <div className="container mt-5">
            <BookFilterBar
                categories={options}
                onSearch={handleSearch}
            />

            {totalElements > 0 ? (
                <>
                    <div className="mt-3">
                        <h5>Number of results: ({totalElements})</h5>
                    </div>
                    <p>
                        {currentPage * booksPerPage - booksPerPage + 1} to{" "}
                        {lastItem} of {totalElements} items
                    </p>
                    {books.map((book) => (
                        <SearchBooks book={book} key={book.id} />
                    ))}
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            paginate={paginate}
                            totalPages={totalPages}
                        />
                    )}
                </>
            ) : (
                <div className="m-5">
                    <h3>Can't find what you are looking for?</h3>
                    <a className="btn btn-dark text-white btn-md px-4 fw-bold" href="#">
                        Library Services
                    </a>
                </div>
            )}
        </div>
    );
};
