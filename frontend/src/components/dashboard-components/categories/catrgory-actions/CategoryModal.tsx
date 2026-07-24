import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTrigger
} from "@/components/ui/dialog";

import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from "react";
import { useCreateCategory, useUpdateCategory } from "@/api/hooks/BookHooks/useCategories";
import { toast } from "sonner";
import { parseApiError } from "@/errors/parseApiError";
import { CategoryDetails } from "@/models/CategoryModel";

interface CategoryModalProps {
    categoryToEdit?: CategoryDetails | null;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger: React.ReactElement;
}

const categorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Category name is required")
        .max(50, "Category name is too long"),
});

type CategoryForm = z.infer<typeof categorySchema>;

export function CategoryModal({
    categoryToEdit,
    open: externalOpen,
    onOpenChange: externalOnOpenChange,
    trigger,
}: CategoryModalProps) {
    const [internalOpen, setInternalOpen] = useState(false);

    const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
    const setIsOpen = externalOnOpenChange ?? setInternalOpen;

    const createCategoryMutation = useCreateCategory();
    const updateCategoryMutation = useUpdateCategory();

    const isEditing = Boolean(categoryToEdit);
    const isPending = createCategoryMutation.isPending || updateCategoryMutation.isPending;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<CategoryForm>({
        resolver: zodResolver(categorySchema),
        mode: "onChange",
        defaultValues: {
            name: "",
        },
    });

    useEffect(() => {
        if (categoryToEdit) {
            reset({ name: categoryToEdit.name });
        } else {
            reset({ name: "" });
        }
    }, [categoryToEdit, reset, isOpen]);

    const handleClose = () => {
        reset();
        createCategoryMutation.reset();
        updateCategoryMutation.reset();
        setIsOpen(false);
    };

    const onSubmit = (values: CategoryForm) => {
        if (isEditing && categoryToEdit) {
            updateCategoryMutation.mutate(
                {
                    categoryId: categoryToEdit.id,
                    requestBody: values
                },
                {
                    onSuccess: () => {
                        toast.success("Category updated");
                        handleClose();
                    },
                    onError: (err: any) => {
                        const apiError = parseApiError(err);
                        toast.error(apiError.message);
                    }
                }
            );
        } else {
            createCategoryMutation.mutate(values, {
                onSuccess: () => {
                    toast.success("Category created.");
                    handleClose();
                },

                onError: (error) => {
                    toast.error(parseApiError(error).message);
                },
            });
        }

    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger render={trigger} />

            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
                    <DialogHeader>
                        {isEditing ? "Edit Category" : "Add New Category"}
                    </DialogHeader>

                    <div className="flex items-center gap-2">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="category-name" className="sr-only">
                                Category Name
                            </Label>
                            <Input
                                id="category-name"
                                placeholder="e.g. Art"
                                disabled={createCategoryMutation.isPending}
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="sm:justify-start">
                        <DialogClose render={
                            <Button type="button" variant="secondary"
                                onClick={() => handleClose}
                                disabled={isPending}
                            >
                                Close
                            </Button>
                        }
                        />

                        <Button
                            type="submit"
                            disabled={
                                !isValid ||
                                createCategoryMutation.isPending
                            }
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isPending
                                ? isEditing
                                    ? "Saving..."
                                    : "Creating..."
                                : isEditing
                                    ? "Save Changes"
                                    : "Add Category"
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}