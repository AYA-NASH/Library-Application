import type { LucideIcon } from "lucide-react";

export type SummaryCardItem = {
    title: string;
    value: number | string;
    icon?: LucideIcon;
    description?: string;
    subDescription?: string;
    trend?: string;
}