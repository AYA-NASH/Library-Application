import { IBookFormInputs } from "../../../types/book-form";

export const buildBookFormData = (
    data: IBookFormInputs,
    imageFile: File | null,
    pdfFile: File | null,
    isEdit: boolean,
    flags: { removedImage: boolean, removedPdf: boolean }
): FormData => {

    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("description", data.description);

    data.categoryIds.forEach(id => {
        formData.append("categoryIds", id.toString());
    });

    if (!isEdit) {
        formData.append("copies", data.copies.toString());
    }

    if (imageFile) formData.append("image", imageFile);
    if (pdfFile) formData.append("pdf", pdfFile);

    if (isEdit) {
        if (flags.removedImage && !imageFile) formData.append("removeImage", "true");
        if (flags.removedPdf && !pdfFile) formData.append("removePdf", "true");
    }

    return formData;
}