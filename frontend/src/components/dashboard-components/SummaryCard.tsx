import { Card, CardContent } from "@/components/ui/card";
import { SummaryCardItem } from "@/models/dashboard/SummaryCard";

type SummaryCardProps = {
    item: SummaryCardItem;
};

export function SummaryCard({ item }: SummaryCardProps) {
    const Icon = item.icon;

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            {item.title}
                        </p>

                        <p className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
                            {item.value}
                        </p>
                    </div>

                    {Icon && (
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" />
                        </div>
                    )}

                    {item.trend && (
                        <div className="rounded-full border px-3 py-1 text-xs font-medium">
                            {item.trend}
                        </div>
                    )}
                </div>

                {(item.description || item.subDescription) && (
                    <div className="mt-6">
                        {item.description && (
                            <p className="font-medium text-foreground">
                                {item.description}
                            </p>
                        )}

                        {item.subDescription && (
                            <p className="mt-1 text-sm text-muted-foreground">
                                {item.description}
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>

    )
}