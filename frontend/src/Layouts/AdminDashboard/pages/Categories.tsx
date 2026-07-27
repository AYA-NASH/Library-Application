import { useCategories, useCategorySummary } from "@/api/hooks/BookHooks/useCategories";
import { categoriesColumns } from "@/components/dashboard-components/categories/categoriesColumns";
import { CategoriesGrid } from "@/components/dashboard-components/categories/CategoriesGrid";
import { CategoryModal } from "@/components/dashboard-components/categories/catrgory-actions/CategoryModal";
import { DashboardPageLayout } from "@/components/dashboard-components/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { buildCategorySummaryCards } from "@/constants/admin-dashboard/buildCategorySummaryCards";
import { useDashboardTable } from "@/hooks/useDashboardTable";
import { Plus } from "lucide-react";

export function Categories() {
    const { data,
        isLoading: isCategoriesLoading,
        isError: isCategoriesError,
        error: categoriesError,
        refetch: refetchCategories
    } = useCategories(1, 20);

    const categories = data?.content ?? [];
    const totalElements = data?.totalElements;

    const { data: categoriesSummary,
        isLoading: isLoadingSummary,
        isError: isSummaryError,
        refetch: refetchSummary
    } = useCategorySummary();

    const categoriesSummaryCards = categoriesSummary ? buildCategorySummaryCards(categoriesSummary) : [];

    const table = useDashboardTable({
        data: categories,
        columns: categoriesColumns,
        pageCount: 5
    });

    return (
        <DashboardPageLayout
            summaryCards={categoriesSummaryCards}
            isLoadingSummary={isLoadingSummary}
            isErrorSummary={isSummaryError}
            onRetrySummary={refetchSummary}
            contentHeader="Categories Management"
            contentAction={
                <CategoryModal trigger={
                    <Button >
                        <Plus />
                        Add Category
                    </Button>
                } />
            }
        >
            <CategoriesGrid
                table={table}
                totalElements={totalElements}
                isLoading={isCategoriesLoading}
                isError={isCategoriesError}
                error={categoriesError}
                onRetry={refetchCategories}
            />

        </DashboardPageLayout>
    );
}