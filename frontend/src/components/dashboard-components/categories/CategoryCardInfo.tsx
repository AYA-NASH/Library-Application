import { CategoryDetails } from "@/models/CategoryModel";

interface Props {
    category: CategoryDetails;
}

export function CategoryCardInfo({ category }: Props) {
    return (
        <div className="flex items-start justify-between">
            <div>
                <h3 className="text-lg font-semibold">
                    {category.name}
                </h3>

                <p className="text-sm text-muted-foreground">
                    {category.booksCount} books
                </p>
            </div>
        </div>
    );
}