import type { Table } from "@tanstack/react-table";

import { CategoryCard } from "./CategoryCard";
import { CategoriesToolbar } from "./CategoriesToolbar";
import { DataTablePagination } from "../table-components/DataTablePagination";
import { CategoryDetails } from "@/models/CategoryModel";
import { CategoryCardsGridSkeleton } from "./catgory-skeleton/CategoryCardsGridSkeleton";


interface Props {
    table: Table<CategoryDetails>;
    totalElements?: number;
    isLoading: boolean;
}

export function CategoriesGrid({
    table,
    totalElements,
    isLoading
}: Props) {
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