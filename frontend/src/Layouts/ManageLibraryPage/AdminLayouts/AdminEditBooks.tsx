import { useState } from "react";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { EditBook } from "../components/EditBook";
import { useBooks } from "../../../api/hooks/BookHooks/useBooks";
import { BookFilterBar } from "../../Utils/BookFilterBar";
import { useCategoriesReferences } from "../../../api/hooks/BookHooks/useCategories";

type SearchParams = {
  text?: string;
  categoryId?: number;
};

export const AdminEditBooks = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState<SearchParams>();
  const [bookDelete, setBookDelete] = useState(false);
  const [bookUpdate, setBookUpdate] = useState(false);

  const booksPerPage = 5;

  const { data: options } = useCategoriesReferences();

  const { data, isLoading, isError, error } = useBooks(
    currentPage,
    booksPerPage,
    searchParams?.text,
    searchParams?.categoryId
  );

  const books = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;

  const handleSearch = (params: SearchParams) => {
    setCurrentPage(1);
    setSearchParams(params);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const deleteBook = () => setBookDelete(prev => !prev);
  const updateBook = () => setBookUpdate(prev => !prev);

  if (isLoading) return <SpinnerLoading />;
  if (isError)
    return (
      <div className="container">
        <p>{(error as Error)?.message}</p>
      </div>
    );

  return (
    <div className="container mt-3">
      <BookFilterBar
        categories={options ?? []}
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
