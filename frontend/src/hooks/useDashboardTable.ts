import { useState } from "react";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type RowSelectionState,
    type SortingState,
    type VisibilityState,
} from "@tanstack/react-table";

interface UseDashboardTableProps<TData, TValue> {
    data: TData[];
    columns: ColumnDef<TData, TValue>[];
    searchFn?: (row: TData, search: string) => boolean;
}

export function useDashboardTable<TData, TValue>({
    data,
    columns,
    searchFn,
}: UseDashboardTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const [globalFilter, setGlobalFilter] = useState("");

    const table = useReactTable({
        data,
        columns,

        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },

        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,

        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),

        globalFilterFn: (row, _, value) => {
            if (!searchFn) return true;

            return searchFn(row.original, String(value));
        },
    });

    return table;
}