import { useCategories } from "@/api/hooks/BookHooks/useCategories";
import { CategoriesCards } from "@/components/dashboard-components/categories/CategoriesCards";
import { categoriesColumns } from "@/components/dashboard-components/categories/categoriesColumns";
import { CategoryModal } from "@/components/dashboard-components/categories/catrgory-actions/CategoryModal";
import { DashboardPageLayout } from "@/components/dashboard-components/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { categoriesCards } from "@/constants/admin-dashboard/fakeCategoriesCards";
import { useDashboardTable } from "@/hooks/useDashboardTable";
import { Plus } from "lucide-react";

export function Categories() {
    const { data, isLoading, isError, error } = useCategories(1, 20);

    const categories = data?.content ?? [];

    const table = useDashboardTable({
        data: categories,
        columns: categoriesColumns,
    });

    return (
        <DashboardPageLayout
            summaryCards={categoriesCards}
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
            <CategoriesCards table={table} />

        </DashboardPageLayout>
    );
}