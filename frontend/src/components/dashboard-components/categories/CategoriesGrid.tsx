import type { Table } from "@tanstack/react-table";

import { CategoryCard } from "./CategoryCard";
import { CategoriesToolbar } from "./CategoriesToolbar";
import { DataTablePagination } from "../table-components/DataTablePagination";
import { CategoryDetails } from "@/models/CategoryModel";
import { CategoryCardsGridSkeleton } from "./catgory-skeleton/CategoryCardsGridSkeleton";
import { QueryErrorAlert } from "@/components/error-handling/QueryErrorAlert";


interface Props {
    table: Table<CategoryDetails>;
    totalElements?: number;
    isLoading: boolean;
    isError?: boolean;
    error?: Error | null;
    onRetry?: () => void;
}

export function CategoriesGrid({
    table,
    totalElements,
    isLoading,
    isError,
    error,
    onRetry,
}: Props) {
    if (isError) {
        return (
            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <QueryErrorAlert
                    title="Failed to load categories"
                    description={
                        error?.message ||
                        "Unable to fetch the category list from the server. Please check your connection and try again."
                    }
                    onRetry={onRetry}
                />
            </div>
        );
    }
    if (isLoading) {
        return <CategoryCardsGridSkeleton cardCount={6} />;
    }

    const rows = table.getRowModel().rows;

    return (
        <div className="space-y-4">
            <CategoriesToolbar table={table} />

            <div className="grid gap-6 md:grid-cols-2">
                {rows.map((row) => (
                    <CategoryCard
                        key={row.original.id}
                        category={row.original}
                    />
                ))}
            </div>

            <DataTablePagination table={table} totalElements={totalElements} />
        </div>
    );
}