import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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