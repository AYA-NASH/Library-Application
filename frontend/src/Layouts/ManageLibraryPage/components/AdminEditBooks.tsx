import { useMemo, useState } from "react";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { EditBook } from "./EditBook";
import { useBooks } from "../../../api/hooks/BookHooks/useBooks";
import { BookFilterBar } from "../../Utils/BookFilterBar";
import { useCategories } from "../../../Hooks/BookHooks/useCategories";

type SearchParams = {
  text?: string;
  categoryId?: number;
};

export const AdminEditBooks = () => {
  const { categories } = useCategories();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState<SearchParams>();
  const [bookDelete, setBookDelete] = useState(false);
  const [bookUpdate, setBookUpdate] = useState(false);

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
        categories={options}
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
