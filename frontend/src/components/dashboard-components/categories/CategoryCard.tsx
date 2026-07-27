import { CategoryDetails } from "@/models/CategoryModel";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { CategoryModal } from "./catrgory-actions/CategoryModal";
import { DeleteCategory } from "./catrgory-actions/DeleteCategory";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

interface Props {
    category: CategoryDetails;
}

export function CategoryCard({ category }: Props) {
    return (
        <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6">
                <div className="space-y-1">
                    <CardTitle>{category.name}</CardTitle>

                    <CardDescription>
                        {category.booksCount === 1
                            ? "1 book"
                            : `${category.booksCount} books`}
                    </CardDescription>
                </div>

                <div className="flex items-center gap-1">
                    <CategoryModal
                        categoryToEdit={category}
                        trigger={
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Edit ${category.name}`}
                            >
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
            </CardHeader>
        </Card>
    );
}