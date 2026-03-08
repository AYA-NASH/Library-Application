import { useEffect, useState } from "react";
import { BookModel } from "../models/BookModel";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/books`;

type SearchParams = {
    text?: string;
    category?: string;
}
export const useBooks = (
    page: number,
    size: number,
    search?: SearchParams,
    /** When these change (e.g. after admin update/delete), the list is refetched. */
    refreshTrigger1?: boolean,
    refreshTrigger2?: boolean
) => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState<null | string>(null);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);


    const fetchBooks = async () => {
        const isInitial = books.length === 0;
        if (isInitial) setIsLoading(true);

        let url = `${BASE_URL}?page=${page - 1}&size=${size}`;

        if (search?.text) {
            url =
                `${BASE_URL}/search/findByTitleContaining?title=${search.text}&page=${page - 1}&size=${size}`;
        }

        if (search?.category) {
            url =
                `${BASE_URL}/search/findByCategory?category=${search.category}&page=${page - 1}&size=${size}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch books");

        }

        const data = await response.json();

        setTotalElements(data.page.totalElements);
        setTotalPages(data.page.totalPages);

        const loadedBooks = data._embedded.books.map((b: any) => ({
            id: b.id,
            title: b.title,
            author: b.author,
            description: b.description,
            copies: b.copies,
            copiesAvailable: b.copiesAvailable,
            dataSource: b.dataSource,
            category: b.category,
            img: b.img,
        }));

        setBooks(loadedBooks);
        setIsLoading(false);
        setHttpError(null);
    }

    useEffect(() => {
        fetchBooks().catch((error) => {
            setHttpError(error.message);
            setIsLoading(false);
        });
    }, [page, size, search?.text, search?.category, refreshTrigger1, refreshTrigger2]);


    return {
        books,
        isLoading,
        httpError,
        totalPages,
        totalElements
    }
}