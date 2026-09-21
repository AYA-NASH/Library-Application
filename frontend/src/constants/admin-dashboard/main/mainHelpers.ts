import { ChartConfig } from "@/components/ui/chart";
import { MainSummaryMetrics, SummaryCardItem, TopCategoriesTrends } from "@/models/MainDashboard";
import { BookOpen, UserRound } from "lucide-react";

export function buildSummaryMetrics(data?: MainSummaryMetrics): SummaryCardItem[] {
    if (!data) return [];

    return [
        {
            title: "Total Books",
            value: data.totalBooks,
            icon: BookOpen,
        },
        {
            title: "Active Loans",
            value: data.activeLoans,
            // description: "Trending up this month",
            // subDescription: "Borrowing activity increased steadily",
            // trend: "+18%"
        },
        {
            title: "Active Members",
            value: data.activeMembers,
            icon: UserRound,
            // description: "Strong member engagement",
            // subDescription: "250 new members this month",
        },
        // {
        //     title: "Revenue",
        //     value: data.totalRevenue,
        //     description: "Trending up this month",
        //     subDescription: " Borrowing activity increased steadily",
        //     trend: "+18%"
        // },
    ]
}

export type ProcessedCategoryData = TopCategoriesTrends & {
    total: number;
    fill: string;
    safeKey: string;
};

export const processCategoryDonutData = (data: TopCategoriesTrends[] | undefined): ProcessedCategoryData[] => {
    if (!data || data.length === 0) return [];

    const withTotals = data.map(item => ({
        ...item,
        total: item.physicalTrends + item.digitalTrends,
        safeKey: item.category.replace(/[^a-zA-Z0-9]/g, '')
    }));

    withTotals.sort((a, b) => b.total - a.total);

    const top4 = withTotals.slice(0, 4);
    const rest = withTotals.slice(4);

    const finalData = [...top4];

    if (rest.length > 0) {
        const otherPhysical = rest.reduce((sum, item) => sum + item.physicalTrends, 0);
        const otherDigital = rest.reduce((sum, item) => sum + item.digitalTrends, 0);

        finalData.push({
            category: "Other",
            physicalTrends: otherPhysical,
            digitalTrends: otherDigital,
            total: otherPhysical + otherDigital,
            safeKey: "Other"
        });
    }

    return finalData.map((item, _) => ({
        ...item,
        fill: `var(--color-${item.safeKey})`
    }));
}

// export const generateCategoryChartConfig = (processedData: ProcessedCategoryData[]): ChartConfig => {
//     // Start with a base config for the tooltip totals if needed
//     const config: Record<string, { label: string; color?: string }> = {
//         total: { label: "Total Reads" },
//         physicalTrends: { label: "Physical Borrows" },
//         digitalTrends: { label: "Digital Reads" }
//     };

//     // Dynamically add the categories mapped to standard Shadcn chart colors
//     processedData.forEach((item, index) => {
//         config[item.safeKey] = {
//             label: item.category,
//             // Uses standard Shadcn charting colors (chart-1 to chart-5)
//             color: `hsl(var(--chart-${index + 1}))`
//         };
//     });

//     return config satisfies ChartConfig;
// };

export const generateCategoryChartConfig = (processedData: ProcessedCategoryData[]): ChartConfig => {
    const config: Record<string, { label: string; color?: string }> = {};
    
    processedData.forEach((item, index) => {
        config[item.safeKey] = {
            label: item.category,
            // Removed the hsl() wrapper to match your exact theme configuration
            color: `var(--chart-${(index % 5) + 1})` 
        };
    });
    
    return config satisfies ChartConfig;
};