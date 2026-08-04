import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookFormSchema, BookFormValues } from "@/constants/admin-dashboard/books/bookFormSchema";
import { AdminBookRequest } from "@/models/Admin";
import { CategoryReference } from "@/models/CategoryModel";
import { buildBookFormData } from "../buildBookFormData";
import { InformationSection } from "./InformationSection";
import { MediaSection } from "./MediaSection";
import { FormControls } from "./FormControls";

interface BookFormProps {
    isEdit?: boolean;
    initialData?: AdminBookRequest;
    categories: CategoryReference[];
    isCategoriesLoading?: boolean;
    onSubmit: (formData: FormData) => void;
    onCancel?: () => void;
    isSubmitting?: boolean;
}

export function BookForm({
    isEdit = false,
    initialData,
    categories = [],
    isCategoriesLoading = false,
    onSubmit,
    onCancel,
    isSubmitting = false,
}: BookFormProps) {

    const methods = useForm<BookFormValues>({
        resolver: zodResolver(bookFormSchema),
        defaultValues: {
            title: initialData?.title ?? "",
            author: initialData?.author ?? "",
            initialCopies: initialData?.copies ?? 1,
            categoryIds: initialData?.categoryIds ?? [],
            description: initialData?.description ?? "",
            imageFile: null,
            pdfFile: null,
            removeImage: false,
            removePdf: false,
        },
    });

    const handleFormSubmit = (values: BookFormValues) => {
        const formData = buildBookFormData(values, isEdit);
        onSubmit(formData);
    };
    return (
        <FormProvider {...methods}>
            <form className="flex h-full flex-col" onSubmit={methods.handleSubmit(handleFormSubmit)}>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <InformationSection categories={categories} isCategoriesLoading={isCategoriesLoading} />
                    
                    <MediaSection pdfFileName={initialData?.pdfFilename} imageName={initialData?.imageFilename} />
                </div>

                <FormControls onCancel={onCancel} isEdit={isEdit} isSubmitting={isSubmitting} />
            </form>
        </FormProvider>
    )
}