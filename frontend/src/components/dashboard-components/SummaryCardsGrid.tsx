import { SummaryCardItem } from "@/models/dashboard/SummaryCard";
import { SummaryCard } from "./SummaryCard";

type SummaryCardsGridProps = {
    items: SummaryCardItem[]
}

export function SummaryCardsGrid({ items }: SummaryCardsGridProps) {
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