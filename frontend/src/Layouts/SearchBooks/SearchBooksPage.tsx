import { useState } from "react";
import { useBooks } from "../../api/hooks/BookHooks/useBooks";
import { BookFilterBar } from "../Utils/BookFilterBar";
import { useCategoriesReferences } from "../../api/hooks/BookHooks/useCategories";
import { ApiErrorDisplay } from "../Utils/ApiErrorDisplay";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { BookSearchCard } from "./BookSearchCard";
import { ColumnFiltersState, PaginationState } from "@tanstack/react-table";
import { useDashboardTable } from "@/hooks/useDashboardTable";
import { bookSearchColumns } from "./components/bookSearchColumns";
import { PaginationSection } from "../Utils/PagintationSection";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";


export const SearchBooksPage = () => {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 5
    });

    // where tanstack table will store the title, and categoryID filters.
    // e.g. {id:"categoryId", value: 5} or {id: "title", value: "Design patterns"}
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const titleFilter = (columnFilters.find(f => f.id === "title")?.value as string) || undefined; // e.g. "Design Patterns"
    const categoryFilterRaw = columnFilters.find(f => f.id === "categoryId")?.value;
    const categoryFilter =
        typeof categoryFilterRaw === "number" && !isNaN(categoryFilterRaw)
            ? categoryFilterRaw
            : undefined; // e.g. 5

    const { data, isLoading, isError, error, refetch } = useBooks(
        pagination.pageIndex + 1,
        pagination.pageSize,
        titleFilter,
        categoryFilter
    );

    const books = data?.content ?? [];

    const table = useDashboardTable({
        data: books,
        columns: bookSearchColumns,
        pageCount: data?.totalPages ?? -1,
        pagination,
        onPaginationChange: setPagination,
        columnFilters,
        onColumnFiltersChange: setColumnFilters,
        manualPagination: true,
        manualFiltering: true
    });

    const { data: options, isLoading: isCategoriesLoading } = useCategoriesReferences();

    const totalElements = data?.totalElements ?? 0;

    return (
        <div className=" mt-5 px-6">
            <BookFilterBar
                table={table}
                categories={options ?? []}
                isLoading={isCategoriesLoading}
            />

            {isLoading && <SpinnerLoading />}
            {isError && <ApiErrorDisplay error={error} title="Failed to load books" onRetry={() => refetch()} />}

            {totalElements > 0 ? (
                <>
                    <div className="text-muted-foreground text-sm">
                        <p>Found {totalElements} results</p>
                    </div>

                    {table.getRowModel().rows.map((row) => (
                        <BookSearchCard book={row.original} key={row.original.id} />
                    ))}

                    <PaginationSection table={table} />
                </>
            ) : (
                <Card className="text-center my-20 py-20">
                    <CardTitle className="text-4xl">Can't find what you are looking for?</CardTitle>
                    <CardDescription>
                        <Link to="/service" className="text-primary underline hover:text-primary/80 cursor-pointer text-xl">
                            Contact Library Services
                        </Link>
                    </CardDescription>
                </Card>
            )}
        </div>
    );
};
