import { useState } from "react";
import { Pagination } from "../Utils/Pagination";
import { SearchBooks } from "./SearchBooks";
import { useBooks } from "../../api/hooks/BookHooks/useBooks";
import { BookFilterBar } from "../Utils/BookFilterBar";
import { useCategoriesReferences } from "../../api/hooks/BookHooks/useCategories";
import { ApiErrorDisplay } from "../Utils/ApiErrorDisplay";
import { SpinnerLoading } from "../Utils/SpinnerLoading";

type SearchParams = {
    text?: string;
    categoryId?: number;
};

export const SearchBooksPage = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams, setSearchParams] = useState<SearchParams>({});

    const booksPerPage = 5;

    const { data: options, isLoading: isCategoriesLoading } = useCategoriesReferences();

    const { data, isLoading, isError, error, refetch } = useBooks(
        currentPage,
        booksPerPage,
        searchParams.text,
        searchParams.categoryId
    );

    const handleSearch = (params: SearchParams) => {
        setCurrentPage(1);
        setSearchParams(params);
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    if (isLoading) return <SpinnerLoading />
    if (isError) return <ApiErrorDisplay error={error} title="Failed to load books" onRetry={() => refetch()} />;


    const books = data?.content ?? [];
    const totalElements = data?.totalElements ?? 0;
    const totalPages = data?.totalPages ?? 0;

    const lastItem =
        currentPage * booksPerPage <= totalElements
            ? currentPage * booksPerPage
            : totalElements;

    return (
        <div className="container mt-5">
            <BookFilterBar
                categories={options ?? []}
                initialCategoryId={searchParams.categoryId}
                initialText={searchParams.text}
                onSearch={handleSearch}
                isLoading={isCategoriesLoading}
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
