import { useState } from "react";
import { StarRating } from "./StarRating";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface LeaveAReviewProps {
    submitReview: (rating: number, reviewText: string) => void;
}

export const LeaveAReview: React.FC<LeaveAReviewProps> = ({
    submitReview,
}) => {
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);

    return (
        <Card className="mx-auto w-full max-w-md">
            <CardContent className="space-y-5">
                <div className="flex flex-col items-center gap-3">
                    <h3 className="text-sm font-semibold">Write a Review</h3>
                    <StarRating editable={true} rating={rating} onRatingChange={setRating} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="review-text" className="text-sm">
                        Your review
                    </Label>
                    <Textarea
                        id="review-text"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Tell us what you think..."
                        rows={3}
                    />
                </div>


                <Button disabled={rating === 0}
                    size="sm"
                    className="w-full"
                    onClick={() => submitReview(rating, reviewText)}
                >
                    Submit Review
                </Button>
            </CardContent>
        </Card>
    );
}