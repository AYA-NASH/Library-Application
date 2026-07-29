import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import {
    Item,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle
} from "@/components/ui/item";

import { BookModel } from "@/models/BookModel";
import { CategoryReference } from "@/models/CategoryModel";
import { FilterFn } from "@tanstack/react-table";

import {
    BookOpen,
    MoreHorizontal,
    PanelLeftOpen,
    PencilIcon,
    TrashIcon
} from "lucide-react";

import { useState } from "react";


interface CategoryCellProps {
    categories?: CategoryReference[]
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
                <Badge key={cat.id} variant="secondary" className="p-3 bg-primary/20">
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

export function BookActionsCell(book: BookModel) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={
                <Button variant={"ghost"} className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            } />

            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <PanelLeftOpen />
                        Open Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <PencilIcon />
                        Edit
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem variant="destructive">
                        <TrashIcon />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const statusFilterFn: FilterFn<BookModel> = (row, columnId, filterValue) => {
    if (!filterValue || filterValue === "all") return true;
    return row.original.status?.toUpperCase() === filterValue.toUpperCase();
};

export const categoryFilterFn: FilterFn<BookModel> = (row, columnId, filterValue) => {
    if (!filterValue || filterValue === "all") return true;

    return row.original.categories?.some(
        (cat) => cat.id.toString() === filterValue || cat.name === filterValue
    ) ?? false;
};