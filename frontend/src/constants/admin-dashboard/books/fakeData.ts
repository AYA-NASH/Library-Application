import { SummaryCardItem } from "@/models/dashboard/SummaryCard";
import { BookOpen } from "lucide-react";

export const booksCards: SummaryCardItem[] = [
    {
        title: "Total Books",
        value: "12,458",
        icon: BookOpen,
    },
    {
        title: "Physical Books",
        value: "1,246",
    },
    {
        title: "Digital Books",
        value: "872",
    },
    {
        title: "Low Stock",
        value: "46",
    },
];



