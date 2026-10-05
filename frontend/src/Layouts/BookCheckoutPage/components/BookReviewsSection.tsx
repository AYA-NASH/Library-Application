import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Loader2, MessageSquareText, X } from "lucide-react";

import { useInfiniteReviews } from "@/api/hooks/BookHooks/useReviews";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ApiErrorDisplay } from "@/Layouts/Utils/ApiErrorDisplay";
import { Review } from "@/Layouts/Utils/Review";
import { cn } from "@/lib/utils";
import { ReviewModel } from "@/models/ReviewModel";

const PAGE_SIZE = 5;
const PREVIEW_COUNT = 2;

interface BookReviewProps {
    bookId: number;
}

export function BookReviewSection({ bookId }: BookReviewProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch,
    } = useInfiniteReviews(bookId, PAGE_SIZE);

    // All loaded pages merged into one list (duplicates removed by id).
    const allReviews = useMemo(() => {
        const unique = new Map<number, ReviewModel>();
        data?.pages.forEach((page) => page.content.forEach((r) => unique.set(r.id, r)));
        return [...unique.values()];
    }, [data]);

    const totalElements = data?.pages[0]?.totalElements ?? 0;
    const visibleReviews = isExpanded ? allReviews : allReviews.slice(0, PREVIEW_COUNT);
    const canExpand = totalElements > PREVIEW_COUNT;

    // If one page holds fewer reviews than the preview needs, fetch the next one.
    useEffect(() => {
        if (!isExpanded && (allReviews.length < PREVIEW_COUNT) && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [isExpanded, allReviews.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Infinite scroll (only while expanded)
    const { rootRef: scrollRef, sentinelRef } = useInfiniteScroll({
        enabled: isExpanded,
        hasMore: !!hasNextPage,
        isLoading: isFetchingNextPage,
        onLoadMore: fetchNextPage,
    });

    const handleCollapse = () => {
        setIsExpanded(false);
        scrollRef.current?.scrollTo({ top: 0 });
        cardRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    if (isLoading) {
        return (
            <Card className="flex items-center justify-center p-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </Card>
        );
    }

    if (isError || !data) {
        return <ApiErrorDisplay error={error} title="Failed to load reviews" onRetry={() => refetch()} />;
    }

    return (
        <Card ref={cardRef} className="gap-4 p-4">
            <div className="flex items-center justify-between">
                <CardTitle className="text-primary uppercase tracking-wider">
                    Book Reviews
                    {totalElements > 0 && (
                        <span className="ml-2 text-xs font-normal text-muted-foreground">({totalElements})</span>
                    )}
                </CardTitle>
                {isExpanded && (
                    <Button variant="ghost" size="icon" onClick={handleCollapse} aria-label="Collapse reviews">
                        <X className="h-5 w-5" />
                    </Button>
                )}
            </div>

            <CardContent className="px-0">
                {totalElements === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
                        <MessageSquareText className="h-6 w-6" />
                        <p className="text-sm">No reviews yet. Be the first to share your thoughts.</p>
                    </div>
                ) : (
                    <div className="relative rounded-lg border border-border">
                        <div
                            ref={scrollRef}
                            className={cn(
                                "p-4",
                                isExpanded ? "max-h-112 overflow-y-auto overscroll-contain" : "overflow-hidden",
                                !isExpanded && canExpand && "pb-14",
                            )}
                        >
                            {visibleReviews.map((review, index) => (
                                <Fragment key={review.id}>
                                    {index > 0 && <Separator className="my-4" />}
                                    <Review review={review} />
                                </Fragment>
                            ))}

                            {isExpanded && (
                                <>
                                    {/* Invisible marker: when it scrolls into view, the next page loads */}
                                    <div ref={sentinelRef} className="h-1" aria-hidden="true" />

                                    {isFetchingNextPage && (
                                        <div className="flex justify-center py-4">
                                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                        </div>
                                    )}

                                    {!hasNextPage && (
                                        <p className="pt-6 pb-2 text-center text-xs text-muted-foreground">
                                            End of reviews
                                        </p>
                                    )}
                                </>
                            )}
                        </div>

                        {!isExpanded && canExpand && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsExpanded(true)}
                                className="absolute right-3 bottom-3 rounded-full"
                                aria-label={`Show all ${totalElements} reviews`}
                            >
                                <ChevronDown className="h-3 w-3" />
                                more
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}