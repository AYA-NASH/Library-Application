import { CategoryDetails } from "@/models/CategoryModel";
import { CategoryCardInfo } from "./CategoryCardInfo";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { CategoryModal } from "./catrgory-actions/CategoryModal";
import { DeleteCategory } from "./catrgory-actions/DeleteCategory";

interface Props {
    category: CategoryDetails;
}

export function CategoryCard({ category }: Props) {
    return (
        <div className="flex items-center justify-between rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
            <CategoryCardInfo category={category} />

            <div className="ml-4 flex shrink-0 items-center gap-1">

                <CategoryModal
                    categoryToEdit={category}
                    trigger={
                        <Button variant="ghost" size="icon" aria-label={`Edit ${category.name}`}>
                            <Pencil className="size-4" />
                        </Button>
                    }
                />

                <DeleteCategory
                    categoryToDelete={category}
                    trigger={
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Delete ${category.name}`}
                        >
                            <Trash2 className="size-4 text-destructive" />
                        </Button>
                    }
                />
            </div>
        </div>
    );
}