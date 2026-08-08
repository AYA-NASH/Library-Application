import { BookFormValues } from "@/constants/admin-dashboard/books/bookFormSchema";

export function buildBookFormData(values: BookFormValues, isEdit: boolean): FormData {
  const formData = new FormData();

  formData.append("title", values.title.trim());
  formData.append("author", values.author.trim());
  formData.append("description", values.description.trim());

  values.categoryIds.forEach((id) => {
    formData.append("categoryIds", id.toString());
  });

  if (!isEdit && values.initialCopies !== undefined) {
    formData.append("copies", values.initialCopies.toString());
  }

  if (values.imageFile) {
    formData.append("image", values.imageFile);
  }
  if (values.pdfFile) {
    formData.append("pdf", values.pdfFile);
  }

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