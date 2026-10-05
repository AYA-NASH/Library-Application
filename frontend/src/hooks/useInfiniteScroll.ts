import { useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
    hasMore: boolean;
    isLoading: boolean;
    onLoadMore: () => void;
    enabled?: boolean;
    offset?: number;
}

export function useInfiniteScroll<
    TRoot extends HTMLElement = HTMLDivElement,
    TSentinel extends HTMLElement = HTMLDivElement,
>({
    hasMore,
    isLoading,
    onLoadMore,
    enabled = true,
    offset = 120
}: UseInfiniteScrollOptions) {
    const rootRef = useRef<TRoot>(null);
    const sentinelRef = useRef<TSentinel>(null);

    useEffect(() => {
        if (!enabled || !hasMore) return;
        const root = rootRef.current;
        const sentinel = sentinelRef.current;

        if (!root || !sentinel) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isLoading) onLoadMore();
            },
            {
                root,
                rootMargin: `0px 0px ${offset}px 0px`
            });

        observer.observe(sentinel);
        return () => observer.disconnect(); 
    }, [enabled, hasMore, isLoading, onLoadMore, offset]);

    return { rootRef, sentinelRef };
}
