import { BookFormValues } from "@/constants/admin-dashboard/books/bookFormSchema";

export function buildBookFormData(values: BookFormValues, isEdit: boolean): FormData {
  const formData = new FormData();

  // Basic Text Fields
  formData.append("title", values.title.trim());
  formData.append("author", values.author.trim());
  formData.append("description", values.description.trim());

  // Multi-select Categories
  values.categoryIds.forEach((id) => {
    formData.append("categoryIds", id.toString());
  });

  // Copies (Only sent on creation)
  if (!isEdit && values.initialCopies !== undefined) {
    formData.append("copies", values.initialCopies.toString());
  }

  // File Uploads (Appended only if a new File was selected)
  if (values.imageFile) {
    formData.append("image", values.imageFile);
  }
  if (values.pdfFile) {
    formData.append("pdf", values.pdfFile);
  }

  // Removal Flags (Only relevant during Edit mode)
  if (isEdit) {
    if (values.removeImage && !values.imageFile) {
      formData.append("removeImage", "true");
    }
    if (values.removePdf && !values.pdfFile) {
      formData.append("removePdf", "true");
    }
  }

  return formData;
}