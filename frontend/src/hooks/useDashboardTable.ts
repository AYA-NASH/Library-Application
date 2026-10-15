import { useState } from "react";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    OnChangeFn,
    PaginationState,
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
    pageCount?: number;
    pagination?: PaginationState;
    onPaginationChange?: OnChangeFn<PaginationState>;
    columnFilters?: ColumnFiltersState;
    onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
    globalFilter?: string;
    onGlobalFilterChange?: (value: string) => void;
    manualPagination?: boolean;
    manualFiltering?: boolean;
}

export function useDashboardTable<TData, TValue>({
    data,
    columns,
    searchFn,
    pageCount,
    pagination: externalPagination,
    onPaginationChange,
    columnFilters: externalColumnFilters,
    onColumnFiltersChange,
    globalFilter: externalGlobalFilter,
    onGlobalFilterChange,
    manualPagination = false,
    manualFiltering = false,
}: UseDashboardTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [internalColumnFilters, setInternalColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [internalGlobalFilter, setInternalGlobalFilter] = useState("");
    const [internalPagination, setInternalPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const globalFilter = externalGlobalFilter ?? internalGlobalFilter;
    const handleGlobalFilterChange = onGlobalFilterChange ?? setInternalGlobalFilter;

    const pagination = externalPagination ?? internalPagination;
    const handlePaginationChange = onPaginationChange ?? setInternalPagination;

    const columnFilters = externalColumnFilters ?? internalColumnFilters;
    const handleColumnFiltersChange = onColumnFiltersChange ?? setInternalColumnFilters;

    const table = useReactTable({
        data,
        columns,
        pageCount: manualPagination ? pageCount : undefined,
        manualPagination,
        manualFiltering,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
            pagination
        },

        onSortingChange: setSorting,
        onColumnFiltersChange: handleColumnFiltersChange,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: handleGlobalFilterChange,
        onPaginationChange: handlePaginationChange,

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