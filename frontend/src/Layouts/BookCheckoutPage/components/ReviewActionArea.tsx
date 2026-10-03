import { useSubmitReview } from "@/api/hooks/BookHooks/useReviews";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { parseApiError } from "@/errors/parseApiError";
import { LeaveAReview } from "@/Layouts/Utils/LeaveAReview";
import { useAuthStore } from "@/store/useAuthStore";
import { LogIn, Star } from "lucide-react";
import { toast } from "sonner";

interface ReviewActionAreaProps {
    bookId: number
    isReviewLeft: boolean;
}

export function ReviewActionArea({
    bookId,
    isReviewLeft,
}: ReviewActionAreaProps) {
    const isAuthenticated = useAuthStore((state) => !!state.token);

    if (!isAuthenticated) {
        return (
            <div className="text-muted-foreground text-center text-sm flex items-center justify-center py-2">
                <LogIn className="mr-2 h-4 w-4" />
                Sign in to leave a review.
            </div>
        );
    }

    const { mutate: submitReviewMutation } = useSubmitReview(bookId);


    const handleSubmitReview = (starInput: number, reviewDescription: string) => {
        submitReviewMutation({ rating: starInput, reviewDescription }, {
            onError: (err) => {
                const apiError = parseApiError(err);
                toast.error(apiError.message);
            },
            onSuccess: () => {
                toast.success("Review submitted successfully!");
            }
        });
    };

    if (isReviewLeft) {
        return (
            <Alert className="bg-green-50 text-green-900 border-green-200">
                <Star className="h-4 w-4 fill-green-600 stroke-green-600" />
                <AlertTitle>Thank you for your review!</AlertTitle>
            </Alert>
        );
    }

    return <LeaveAReview submitReview={handleSubmitReview} />;
}