import type { Table } from "@tanstack/react-table";

import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props<TData> {
    table: Table<TData>;
    totalElements?: number;
}

export function DataTablePagination<TData>({
    table,
    totalElements,
}: Props<TData>) {

    const { pageIndex } = table.getState().pagination;
    const totalRows = totalElements ?? table.getFilteredRowModel().rows.length;

    return (
        <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
                Showing{" "}
                {table.getRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} items
            </p>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="text-sm">
                    {pageIndex + 1} / {table.getPageCount() > 0 ? table.getPageCount() : 1}
                </span>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}