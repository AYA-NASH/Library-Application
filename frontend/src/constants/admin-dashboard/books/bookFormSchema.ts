import * as z from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const MAX_PDF_SIZE = 50 * 1024 * 1024; // 50MB

export const bookFormSchema = z.object({
    title: z
        .string()
        .min(5, "Book title must be at least 5 characters."),
    author: z
        .string()
        .min(5, "Author Name must be at least 5 characters.")
        .max(100, "Author Name must be at most 100 characters."),
    initialCopies: z.number().min(1, "at least add single copy"),
    description: z
        .string()
        .min(20, "Description must be at least 20 characters.")
        .max(100, "Description must be at most 100 characters."),
    categoryIds: z
        .array(z.number())
        .min(1, "Select at least one category."),
    imageFile: z
        .instanceof(File)
        .nullable()
        .optional()
        .refine(
            (file) => !file || file.size <= MAX_IMAGE_SIZE,
            "Max image size is 5MB."
        )
        .refine(
            (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Only .jpg, .png, and .webp formats are supported."
        ),

    removeImage: z.boolean().default(false),

    pdfFile: z
        .instanceof(File, { message: "Book PDF is required" })
        .nullable()
        .optional()
        .refine((file) => !file || file.size <= MAX_PDF_SIZE, "Max PDF size is 50MB.")
        .refine(
            (file) => !file || file.type === "application/pdf",
            "Only PDF files are supported."
        ),

    removePdf: z.boolean().default(false),
});

export type BookFormValues = z.infer<typeof bookFormSchema>;