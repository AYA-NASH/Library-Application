import { useMainSummary } from "@/api/hooks/LibraryServiceHooks/useDashboard";
import { DashboardPageLayout } from "@/components/dashboard-components/DashboardPageLayout";
import { AnalyticsAreaChart } from "@/components/dashboard-components/main/AnalyticsAreaChart";
import { CategoryTrends } from "@/components/dashboard-components/main/CategoryTrends";
import { InventoryHealth } from "@/components/dashboard-components/main/InventoryHealth";
import { MostPopularBooks } from "@/components/dashboard-components/main/MostPopularBooks";
import { RecentActivity } from "@/components/dashboard-components/main/RecentActivity";
import { buildSummaryMetrics } from "@/constants/admin-dashboard/main/mainHelpers";

export function MainPage() {

    const { data: metrics, isLoading, isError } = useMainSummary();

    const dashboardCards = buildSummaryMetrics(metrics);
    return (
        <DashboardPageLayout
            topHeader="Dashboard Overview"
            topSubDescription="Welcome to your production administration panel."
            summaryCards={dashboardCards}
        >
            <RecentActivity />

            <div className="grid gap-6 lg:grid-cols-[7fr_3fr]">
                <AnalyticsAreaChart />
                <CategoryTrends />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                <InventoryHealth />
                <MostPopularBooks />
            </div>
        </DashboardPageLayout>
    )
}