import { SummaryCardItem } from "@/models/dashboard/SummaryCard";
import { SummaryCard } from "./SummaryCard";
import { SummaryGridSkeleton } from "./SummaryGridSkeleton";

type SummaryCardsGridProps = {
    items: SummaryCardItem[];
    isLoading?: boolean;
}

export function SummaryCardsGrid({ items, isLoading }: SummaryCardsGridProps) {
    if (isLoading) {
        return <SummaryGridSkeleton />
    }
    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => (
                <SummaryCard
                    key={item.title}
                    item={item}
                />
            ))}
        </div>
    );
}