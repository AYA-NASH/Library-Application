import { CategorySummaryResponse } from "@/models/CategoryModel";
import { SummaryCardItem } from "@/models/dashboard/SummaryCard";
import { Folder, Layers, AlertCircle, BookOpen } from "lucide-react";

export function buildCategorySummaryCards(data?: CategorySummaryResponse): SummaryCardItem[] {
    if (!data) return [];

    return [
        {
            title: "Total Categories",
            value: data.totalCategories,
            icon: Folder,
        },
        {
            title: "Largest Category",
            value: data.largestCategoryName,
            subDescription: `${data.largestCategoryCount} books linked`,
            icon: Layers,
        },
        {
            title: "Average Density",
            value: `${data.avgBooksPerCategory}`,
            description: "Books per category",
            icon: BookOpen,
        },
        {
            title: "Action Required",
            value: data.emptyCategoriesCount,
            description: "Empty Categories",
            subDescription: `${data.uncategorizedBooksCount} uncategorized books`,
            icon: AlertCircle,
        },
    ];
}