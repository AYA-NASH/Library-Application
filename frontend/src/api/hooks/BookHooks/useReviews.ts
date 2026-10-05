import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "../../services/reviewService";
import { useAuthStore } from "../../../store/useAuthStore";
import { ReviewRequest } from "../../../models/ReviewModel";

export const useReviews = (bookId: number | string, page: number, size: number) => {
    return useQuery({
        queryKey: ["book-reviews", bookId, { page, size }],
        queryFn: () => reviewService.getBookReviews(bookId, page, size),
        staleTime: 1000 * 60 * 2,
    });
};

export const useInfiniteReviews = (bookId: number | string, size: number = 5) => {
    return useInfiniteQuery({
        // Nested under "book-reviews" so useSubmitReview's prefix invalidation
        // (["book-reviews", bookId]) refreshes this list too.
        queryKey: ["book-reviews", bookId, "infinite", { size }],
        // reviewService is 1-based (it sends page - 1 to Spring), so we start at 1.
        initialPageParam: 1,
        queryFn: ({ pageParam }) => reviewService.getBookReviews(bookId, pageParam, size),

        getNextPageParam: (lastPage, allPages) => {
            // allPages.length = number of pages already loaded (1-based next page = length + 1)
            if (allPages.length < lastPage.totalPages) {
                return allPages.length + 1;
            }
            // tells React Query there are no more pages
            return undefined;
        },
        enabled: !!bookId,
        staleTime: 1000 * 60 * 2,
    });
}

export const useIsBookReviewedByUser = (bookId: number | string) => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    return useQuery({
        queryKey: ["user-review-status", bookId],
        queryFn: () => reviewService.getIsBookReviewedByUser(bookId),
        enabled: !!bookId && isAuthenticated,
    });
};

export const useSubmitReview = (bookId: number | string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reviewRequest: ReviewRequest) =>
            reviewService.submitReview(reviewRequest, bookId),

        onSuccess: () => {
            // Refetch the review list for this book
            queryClient.invalidateQueries({ queryKey: ["book-reviews", bookId] });
            // Update the "Has user reviewed" status
            queryClient.invalidateQueries({ queryKey: ["user-review-status", bookId] });
        },
        onError: (error: any) => {
            console.error('Post failed:', error?.message);
        }
    });
};