import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MessageTicketSkeleton() {
    return (
        <Card className="rounded-3xl border-l-4 shadow-sm">
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-56" />
                        </div>

                        <Skeleton className="h-4 w-28" />
                    </div>

                    <Skeleton className="h-6 w-20 shrink-0 rounded-full" />
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="space-y-3 rounded-2xl bg-muted p-4">
                    <Skeleton className="h-4 w-48" />

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Skeleton className="h-9 w-32 rounded-md" />
                </div>
            </CardContent>
        </Card>
    );
}