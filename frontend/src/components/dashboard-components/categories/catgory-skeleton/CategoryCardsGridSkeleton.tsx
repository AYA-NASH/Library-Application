import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
    cardCount?: number;
}

export function CategoryCardsGridSkeleton({ cardCount = 6 }: Props) {
    return (
        <div className="grid gap-6 md:grid-cols-2">

            {Array.from({ length: cardCount }).map((_, index) => (

                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6">
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-36" />
                            <Skeleton className="h-4 w-20" />
                        </div>

                        <div className="flex items-center gap-1">
                            <Skeleton className="size-9 rounded-md" />
                            <Skeleton className="size-9 rounded-md" />
                        </div>
                    </CardHeader>
                </Card>
            ))}
        </div>
    );
}