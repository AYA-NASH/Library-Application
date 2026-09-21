import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventorySummary } from "@/api/hooks/LibraryServiceHooks/useDashboard";
import { Loader2 } from "lucide-react";

export interface InventoryHealthItem {
    id: string;
    label: string;
    count: number;
    status: 'error' | 'warning' | 'neutral' | 'info';
}

const statusColors = {
    error: "bg-destructive",
    warning: "bg-amber-500",
    neutral: "bg-zinc-400 dark:bg-zinc-500",
    info: "bg-blue-500"
};

export const InventoryHealth = () => {
    const { data, isLoading, isError } = useInventorySummary();

    const InventoryRow = ({ item }: { item: InventoryHealthItem }) => (
        <div 
            className="flex items-center justify-between p-3 rounded-md bg-card border border-border hover:bg-accent/30 dark:hover:bg-accent/10 transition-colors"
            style={{ borderRadius: 'calc(var(--radius) - 4px)' }}
        >
            <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${statusColors[item.status]}`} />
                <span className="text-sm font-medium">
                    {item.label}
                </span>
            </div>
            <span className="text-xs font-bold tabular-nums bg-muted text-muted-foreground px-2 py-1 rounded-sm">
                {item.count.toLocaleString()}
            </span>
        </div>
    );

    return (
        <Card className="rounded-lg flex flex-col h-full shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle>Inventory Summary</CardTitle>
                <CardDescription>
                    Operational alerts and catalog composition
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="flex h-full min-h-62.5 items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : isError || !data ? (
                    <div className="flex h-full min-h-62.5 items-center justify-center text-sm text-destructive">
                        Failed to load inventory summary
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Action Required / Alerts */}
                        <div className="space-y-2.5">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                                Action Required
                            </h4>
                            <InventoryRow item={{ id: "a1", label: "Overdue Loans", count: data.alerts.overdueLoans, status: "error" }} />
                            <InventoryRow item={{ id: "a2", label: "Out of Stock", count: data.alerts.outOfStock, status: "error" }} />
                            <InventoryRow item={{ id: "a3", label: "Low Stock Items", count: data.alerts.lowStock, status: "warning" }} />
                        </div>

                        {/* Utilization */}
                        <div className="space-y-2.5">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                                Stock Utilization
                            </h4>
                            {/* Updated to shelfUtilization */}
                            <InventoryRow item={{ id: "u1", label: "Total Physical Copies", count: data.shelfUtilization.totalCopies, status: "neutral" }} />
                            <InventoryRow item={{ id: "u2", label: "Available on Shelves", count: data.shelfUtilization.availableCopies, status: "info" }} />
                        </div>

                        {/* Composition */}
                        <div className="space-y-2.5">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                                Catalog Makeup
                            </h4>
                            {/* Updated to catalogComposition */}
                            <InventoryRow item={{ id: "c1", label: "Physical Only Titles", count: data.catalogComposition.physicalOnly, status: "neutral" }} />
                            <InventoryRow item={{ id: "c2", label: "Digital Only Titles", count: data.catalogComposition.digitalOnly, status: "neutral" }} />
                            <InventoryRow item={{ id: "c3", label: "Hybrid (Both Formats)", count: data.catalogComposition.hybrid, status: "neutral" }} />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};