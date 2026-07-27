import { SummaryCardItem } from "@/models/dashboard/SummaryCard";
import { TopNavigationBar } from "./TopNavigationBar";
import { SummaryCardsGrid } from "./summary-cards/SummaryCardsGrid";
import { ContentHeaders } from "./ContentHeaders";

interface DashboardPageLayoutProps {
    children: React.ReactNode;
    summaryCards?: SummaryCardItem[];
    isLoadingSummary?: boolean;
    isErrorSummary?: boolean;
    onRetrySummary?: () => void;
    topHeader?: string;
    topSubDescription?: string;
    contentHeader?: string;
    contentSubDescription?: string;
    contentAction?: React.ReactNode;
}
export function DashboardPageLayout({
    children,
    summaryCards,
    isLoadingSummary,
    isErrorSummary,
    onRetrySummary,
    topHeader,
    topSubDescription,
    contentHeader,
    contentSubDescription,
    contentAction,
}: DashboardPageLayoutProps) {
    return (
        <div className="flex  flex-1 flex-col gap-6 bg-background p-6 w-full min-w-0">
            <TopNavigationBar
                containHeader={Boolean(topHeader)}
                header={topHeader}
                subDescription={topSubDescription}
            />
            {summaryCards && (
                <SummaryCardsGrid
                    items={summaryCards}
                    isLoading={isLoadingSummary}
                    isError={isErrorSummary}
                    onRetry={onRetrySummary}
                />)}
            {contentHeader && (
                <ContentHeaders
                    header={contentHeader}
                    subDescription={contentSubDescription}
                    action={contentAction}
                />
            )}
            {children}
        </div>
    );
}
