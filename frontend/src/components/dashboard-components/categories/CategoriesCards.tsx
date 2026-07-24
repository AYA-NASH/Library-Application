import type { Table } from "@tanstack/react-table";

import { CategoryCard } from "./CategoryCard";
import { CategoriesToolbar } from "./CategoriesToolbar";
import { DataTablePagination } from "../table-components/DataTablePagination";
import { CategoryDetails } from "@/models/CategoryModel";


interface Props {
    table: Table<CategoryDetails>;
}

export function CategoriesCards({ table }: Props) {
    const rows = table.getRowModel().rows;

    return (
        <div>
            <CategoriesToolbar table={table} />

            <div className="grid gap-6 lg:grid-cols-[1fr_1fr] space-y-4">
                {rows.map((row) => (
                    <CategoryCard
                        key={row.original.id}
                        category={row.original}
                    />
                ))}
            </div>

            <DataTablePagination table={table} />
        </div>
    );
}