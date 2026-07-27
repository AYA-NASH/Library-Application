import { SummaryCardItem } from "@/models/dashboard/SummaryCard";
import { SummaryCard } from "./SummaryCard";
import { SummaryGridSkeleton } from "./SummaryGridSkeleton";
import { QueryErrorAlert } from "@/components/error-handling/QueryErrorAlert";

type SummaryCardsGridProps = {
    items: SummaryCardItem[];
    isLoading?: boolean;
    isError?: boolean;
    onRetry?: () => void;
}

export function SummaryCardsGrid({
    items,
    isLoading,
    isError,
    onRetry
}: SummaryCardsGridProps) {
    if (isError) {
        return (
            <QueryErrorAlert
                title="Failed to load summary statistics"
                description="Could not retrieve category metrics. Please check your network or try again."
                onRetry={onRetry}
            />
        );
    }
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