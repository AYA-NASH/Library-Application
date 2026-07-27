import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryCardItem } from "@/models/dashboard/SummaryCard";

type SummaryCardProps = {
    item: SummaryCardItem;
};

export function SummaryCard({ item }: SummaryCardProps) {
    const Icon = item.icon;

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="space-y-2">
                    <CardDescription>
                        {item.title}
                    </CardDescription>

                    <CardTitle className="text-4xl font-semibold tracking-tight">
                        {item.value}
                    </CardTitle>
                </div>

                {(Icon || item.trend) && (
                    <div className="flex flex-col items-end gap-2">
                        {Icon && (
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <Icon className="size-5" />
                            </div>
                        )}

                        {item.trend && (
                            <div className="rounded-full border px-3 py-1 text-xs font-medium">
                                {item.trend}
                            </div>
                        )}
                    </div>
                )}
            </CardHeader>

            {(item.description || item.subDescription) && (
                <CardContent>
                    <div className="mt-6">
                        {item.description && (
                            <p className="font-medium text-foreground">
                                {item.description}
                            </p>
                        )}

                        {item.subDescription && (
                            <p className="mt-1 text-sm text-muted-foreground">
                                {item.subDescription}
                            </p>
                        )}
                    </div>
                </CardContent>
            )}
        </Card>

    )
}