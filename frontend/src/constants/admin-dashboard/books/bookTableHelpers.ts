import { BookModel } from "@/models/BookModel";
import { TableFilterConfig } from "../TableFilterConfig";
import { CategoryDetails } from "@/models/CategoryModel";
import { useMemo } from "react";
import { BookSummaryResponse } from "@/models/Admin";
import { SummaryCardItem } from "@/models/dashboard/SummaryCard";
import { AlertTriangle, BookOpen, FileText, Library } from "lucide-react";

export function useBookFilters(
    books: BookModel[],
    categories: CategoryDetails[] = []
): TableFilterConfig[] {
    return useMemo(() => {
        const availableCount = books.filter(b => b.status === "AVAILABLE" || b.status === "available").length;
        const outOfStockCount = books.filter(b => b.status === "OUT_OF_STOCK" || b.status === "out_of_stock").length;

        const categoryOptions = categories.map((cat) => ({
            value: cat.name,
            label: cat.name,
            count: cat.booksCount,
        }));

        return [
            {
                id: "status",
                title: "Status",
                type: "radio",
                options: [
                    { value: "AVAILABLE", label: `Available (${availableCount})` },
                    { value: "OUT_OF_STOCK", label: `Out of Stock (${outOfStockCount})` },
                ],
            },
            {
                id: "categories",
                title: "Categories",
                type: "radio",
                options: categoryOptions,
            },
        ];
    }, [books, categories]);
}

export function buildBooksSummaryCards(data?: BookSummaryResponse): SummaryCardItem[] {
    if (!data) return [];

    return [
        {
            title: "Total Books",
            value: data.totalTitles.toLocaleString(),
            icon: BookOpen,
        },
        {
            title: "Physical Inventory",
            value: data.totalPhysicalCopies.toLocaleString(),
            icon: Library,
        },
        {
            title: "Digital Books",
            value: data.digitalBooks.toLocaleString(),
            icon: FileText,
        },
        {
            title: "Out of Stock",
            value: data.outOfStock.toLocaleString(),
            icon: AlertTriangle,
        },
    ];
}