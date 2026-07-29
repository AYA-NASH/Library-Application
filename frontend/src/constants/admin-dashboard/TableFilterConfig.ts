import type { Table } from "@tanstack/react-table";

export interface TableFilterOption {
    label: string;
    value: string;
    count?: number;
}

export interface TableFilterConfig {
    id: string;
    title: string;
    options: TableFilterOption[];
    type: "radio" | "checkbox";
    filterFn?: (table: Table<any>, value: string) => void;
}