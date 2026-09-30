import { useEffect, useState } from "react";
import { CategoryReference } from "../../models/CategoryModel";
import { BookModel } from "@/models/BookModel";
import { Table } from "@tanstack/react-table";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";



type BookFilterBarProps = {
    table: Table<BookModel>
    categories: CategoryReference[];
    isLoading?: boolean;
};

export const BookFilterBar: React.FC<BookFilterBarProps> = ({
    table,
    categories,
    isLoading = false,
}) => {
    const titleColumn = table.getColumn("title");
    const categoryColumn = table.getColumn("categoryId");

    const currentTitleFilter = (titleColumn?.getFilterValue() as string) ?? ""; // e.g. "Design Patterns"
    const currentCategoryFilter = categoryColumn?.getFilterValue() as number | undefined; // e.g. 5

    const [localSearchText, setLocalSearchText] = useState(currentTitleFilter);

    const hasActiveFilters = currentTitleFilter !== "" || currentCategoryFilter !== undefined;

    // Sync local state if table state resets externally
    useEffect(() => {
        setLocalSearchText(currentTitleFilter);
    }, [currentTitleFilter]);

    // Handlers push data back to the Table state
    const handleSearchClick = () => {
        titleColumn?.setFilterValue(localSearchText.trim() || undefined);
    };

    const handleCategoryChange = (value: string | null) => {
        categoryColumn?.setFilterValue(!value || value === "all" ? undefined : Number(value));
    };

    const handleResetFilters = () => {
        setLocalSearchText("");
        titleColumn?.setFilterValue(undefined);
        categoryColumn?.setFilterValue(undefined);
    };
    return (
        <div className="mb-8 flex flex-col md:flex-row gap-6 md:items-end">

            {/* Search Input Section */}
            <div className="flex w-full flex-1 flex-col gap-2 md:max-w-md">
                <Label htmlFor="title-search" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Search by Title
                </Label>
                <div className="relative flex items-center">
                    <Input
                        id="title-search"
                        type="text"
                        placeholder="e.g. Design Patterns..."
                        value={localSearchText}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            setLocalSearchText(newValue);

                            if (newValue.trim() === "") {
                                titleColumn?.setFilterValue(undefined);
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearchClick();
                        }}
                        className="w-full pr-12"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleSearchClick}
                        aria-label="Search"
                        className="absolute right-0 text-muted-foreground hover:text-foreground"
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="hidden max-h-full w-px bg-border md:block" />

            {/* Category Select Section */}
            <div className="flex w-full flex-col gap-2 md:w-64">
                <Label htmlFor="category-select" className="text-xs font-semibold tracking-wider text-muted-foreground">
                    OR Browse by Category
                </Label>
                <Select
                    disabled={isLoading}
                    value={currentCategoryFilter ? String(currentCategoryFilter) : "all"}
                    onValueChange={handleCategoryChange}
                >
                    <SelectTrigger id="category-select" className="w-full bg-background">
                        <SelectValue>
                            {currentCategoryFilter
                                ? (categories?.find((c) => c.id === currentCategoryFilter)?.name ?? "All Categories")
                                : (isLoading ? "Loading…" : "All Categories")}
                        </SelectValue>
                    </SelectTrigger>

                    <SelectContent className="max-h-75">
                        <SelectGroup>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories?.map((category) => (
                                <SelectItem key={category.id} value={String(category.id)}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {hasActiveFilters && (
                <Button
                    variant="ghost"
                    onClick={handleResetFilters}
                    className="w-full text-muted-foreground hover:text-foreground md:w-auto"
                >
                    <X className="mr-2 h-4 w-4" />
                    Reset
                </Button>
            )}
        </div>
    );
};
