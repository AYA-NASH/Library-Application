import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
    cardCount?: number;
}

export function SummaryGridSkeleton({ cardCount = 4 }: Props) {
    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: cardCount }).map((_, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-start justify-between space-y-0">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-20" />
                        </div>

                        <Skeleton className="size-11 rounded-2xl" />
                    </CardHeader>

                    <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}