import { cn } from "@/lib/utils";
import { Star, StarHalf } from "lucide-react";
import { useState } from "react";

type StarRatingProps = {
    rating: number | null | undefined;
    size?: number;
    totalStars?: number;
} & (
        | {
            editable?: false;
            onRatingChange?: never;
        }
        | {
            editable: true;
            onRatingChange: (rating: number) => void;
        }
    )

export function StarRating({
    rating, //actual selected rating
    size = 24,
    totalStars = 5,
    editable = false,
    onRatingChange
}: StarRatingProps) {
    const [hoverValue, setHoverValue] = useState(0); //  temporary preview while hovering

    // Normalise the incoming value: null / undefined / NaN → 0, and clamp to [0, totalStars].
    const safeRating = Number.isFinite(rating)
        ? Math.min(Math.max(rating as number, 0), totalStars)
        : 0;

    // If editable and the user is hovering, show the hover preview.
    //  Otherwise, show actual rating.
    const currentRating = (editable && hoverValue > 0) ? hoverValue : safeRating;

    return (
        <div
            className={cn(
                "flex items-center gap-1",
                editable && "cursor-pointer"
            )}
            onMouseLeave={() => editable && setHoverValue(0)}
            role="img"
            aria-label={`Rated ${safeRating} out of ${totalStars}`}
        >
            {Array.from({ length: totalStars }).map((_, index) => {
                const starValue = index + 1;
                const isFull = currentRating >= starValue;

                const isHalf =
                    !isFull &&
                    currentRating >= starValue - 0.5;
                return (
                    <div key={index}
                        onClick={() => editable && onRatingChange?.(starValue)}
                        onMouseEnter={() => editable && setHoverValue(starValue)}
                        className={cn(
                            "relative flex items-center justify-center",
                            editable && "transition-transform hover:scale-110"
                        )}
                    >

                        <Star
                            size={size}
                            className="text-muted-foreground/30"
                        />

                        {(isFull || isHalf) && (
                            <span className="absolute inset-0 flex items-center justify-center">
                                {isFull ? (
                                    <Star size={size} className="fill-yellow-400 text-yellow-400" />
                                ) : (
                                    <StarHalf size={size} className="fill-yellow-400 text-yellow-400" />
                                )}
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}