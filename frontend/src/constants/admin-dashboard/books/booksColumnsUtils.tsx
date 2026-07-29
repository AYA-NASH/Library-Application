import { Badge } from "@/components/ui/badge";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { BookModel } from "@/models/BookModel";
import { BookOpen } from "lucide-react";
import { useState } from "react";

interface Category {
    id: string | number // Accept both string and number IDs
    name: string
}

interface CategoryCellProps {
    categories?: Category[] // Mark as optional so it handles undefined/null safely
}
export function CategoryCell({
    categories
}: CategoryCellProps) {
    const [expanded, setExpanded] = useState(false);
    if (!categories || categories.length === 0) {
        return (
            <Badge variant="secondary">-</Badge>
        );
    }

    const MAX_VISIBLE = 2;

    const hasMore = categories.length > MAX_VISIBLE;
    const hiddenCount = categories.length - MAX_VISIBLE;
    const displayedCategories = expanded ? categories : categories.slice(0, MAX_VISIBLE);
    return (
        <div className="flex flex-wrap items-center gap-1 max-w-62.5">
            {displayedCategories.map((cat) => (
                <Badge key={cat.id} variant="secondary">
                    {cat.name}
                </Badge>
            ))}
            {hasMore && (
                <Badge variant="outline"
                    className="cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation()
                        setExpanded((prev) => !prev)
                    }}
                >
                    {expanded ? "Show less" : `+${hiddenCount} more`}

                </Badge>
            )}
        </div>
    );
}

export function BookCell(book: BookModel) {
    const [imgError, setImgError] = useState(false);

    return (
        <Item>
            <ItemMedia className="h-16 w-11">
                {!imgError && book.img ? (
                    <img
                        src={book.img}
                        alt={book.title}
                        className="h-full w-full object-cover"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <BookOpen className="h-5 w-5 opacity-70 text-muted-foreground" />
                )}
            </ItemMedia>

            <ItemContent>
                <ItemTitle className="font-medium cursor-pointer hover:underline">
                    {book.title}
                </ItemTitle>
                <ItemDescription>
                    {book.author}
                </ItemDescription>
            </ItemContent>
        </Item>
    );
}