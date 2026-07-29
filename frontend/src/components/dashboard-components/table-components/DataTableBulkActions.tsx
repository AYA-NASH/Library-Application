import type { ReactNode } from "react";

import type { Table } from "@tanstack/react-table";

interface Props<TData> {
    table: Table<TData>;
    children: ReactNode;
}

export function DataTableBulkActions<TData>({
    table,
    children,
}: Props<TData>) {
    const selected =
        table.getFilteredSelectedRowModel().rows.length;

    if (selected === 0) return null;

    return (
        <div className="mb-4 flex items-center justify-between rounded-lg border bg-card p-3">
            <span className="text-sm text-muted-foreground">
                {selected} selected
            </span>

            <div className="flex gap-2">
                {children}
            </div>
        </div>
    );
}