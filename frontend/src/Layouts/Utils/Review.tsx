import { ReviewModel } from "../../models/ReviewModel";
import { StarRating } from "./StarRating";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ReviewProps {
    review: ReviewModel;
}

export function Review({ review }: ReviewProps) {
    const formattedDate = new Date(review.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });

    const initial = review.userEmail ? review.userEmail.charAt(0).toUpperCase() : "U";

    return (
        <div className="flex flex-col space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {initial}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <h5 className="truncate font-medium text-sm text-foreground">{review.userEmail}</h5>
                        <span className="text-xs text-muted-foreground">{formattedDate}</span>
                    </div>
                </div>

                <div className="shrink-0 pl-12 sm:pl-0">
                    <StarRating rating={review.rating} size={16} />
                </div>
            </div>

            <p className="text-sm text-foreground leading-relaxed break-words sm:ml-12">
                {review.reviewDescription}
            </p>
        </div>
    );
}