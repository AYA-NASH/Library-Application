import React from "react";
import type {
    ColumnDef,
    Table,
} from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";

import {
    Table as TanStackTable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TableFilterConfig } from "@/constants/admin-dashboard/TableFilterConfig";
import { useDashboardTable } from "@/hooks/useDashboardTable";
import { DataTableToolbar } from "./DataTableToolbar";
import { DataTableColumnToggle } from "./DataTableColumnToggle";
import { DataTableBulkActions } from "./DataTableBulkActions";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableSkeleton } from "./DataTableSkeleton";
import { QueryErrorAlert } from "@/components/error-handling/QueryErrorAlert";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isLoading?: boolean;
    isError?: boolean;
    error?: Error | null;
    onRetry: () => void;
    searchPlaceholder?: string;
    filters: TableFilterConfig[];
    searchFn?: (row: TData, search: string) => boolean;
    bulkActions?: (table: Table<TData>) => React.ReactNode;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    isLoading,
    isError,
    error,
    onRetry,
    searchPlaceholder,
    filters,
    searchFn,
    bulkActions,
}: DataTableProps<TData, TValue>) {
    const table = useDashboardTable({
        data,
        columns,
        searchFn,
    });

    if (isLoading) {
        return <DataTableSkeleton columnCount={columns.length} />
    }

    if (isError) {
        return (
            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <QueryErrorAlert
                    title="Failed to load categories"
                    description={
                        error?.message ||
                        "Unable to fetch the Books from the server. Please check your connection and try again."
                    }
                    onRetry={onRetry}
                />
            </div>
        );
    }
    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <DataTableToolbar
                    table={table}
                    searchPlaceholder={searchPlaceholder}
                    filters={filters}
                />

                <DataTableColumnToggle table={table} />
            </div>

            {bulkActions && (
                <DataTableBulkActions table={table}>
                    {bulkActions(table)}
                </DataTableBulkActions>
            )}

            <div className="mb-4 overflow-hidden rounded-md border">
                <TanStackTable>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="h-24"
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={
                                        table.getVisibleLeafColumns().length
                                    }
                                    className="h-24 text-center align-middle"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </TanStackTable>
            </div>

            <DataTablePagination table={table} />
        </div>
    );
}