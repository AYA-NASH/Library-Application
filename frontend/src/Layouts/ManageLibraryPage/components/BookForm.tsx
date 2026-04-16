import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCategoriesReferences } from "../../../api/hooks/BookHooks/useCategories";
import { useFileUpload } from "../FormUtilities/useFileUpload";
import { buildBookFormData } from "../FormUtilities/BookFormUtils";

import { CategorySelectField } from "../FormUtilities/CategorySelectField";
import { ImageUploadField } from "../FormUtilities/ImageUploadField";
import { PdfUploadField } from "../FormUtilities/PdfUploadField";
import { IBookFormInputs } from "../../../types/book-form";
import { AdminBookRequest } from "../../../models/Admin";

interface BookFormProps {
  isEdit: boolean;
  initialData?: AdminBookRequest;
  onSubmit: (formData: FormData) => void;
}

export const BookForm: React.FC<BookFormProps> = ({ isEdit, initialData, onSubmit }) => {
  const { data: options } = useCategoriesReferences();
  const { control, register, handleSubmit, formState: { errors } } = useForm<IBookFormInputs>({
    defaultValues: {
      title: initialData?.title ?? "",
      author: initialData?.author ?? "",
      description: initialData?.description ?? "",
      categoryIds: initialData?.categoryIds ?? [],
      copies: initialData?.copies ?? 0,
    }
  });

  // State for removal flags
  const [removedCurrentPdf, setRemovedCurrentPdf] = useState(false);
  const [removedCurrentImage, setRemovedCurrentImage] = useState(false);

  // File Upload Hooks
  const imageUpload = useFileUpload({
    maxSizeMB: 5,
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    initialFileUrl: initialData?.imageUrl,
  });

  const pdfUpload = useFileUpload({
    maxSizeMB: 50,
    allowedTypes: ["application/pdf"],
  });

  const onFormSubmit = (data: IBookFormInputs) => {
    const formData = buildBookFormData(
      data,
      imageUpload.file,
      pdfUpload.file,
      isEdit,
      { removedImage: removedCurrentImage, removedPdf: removedCurrentPdf }
    );
    onSubmit(formData);
  };

  const imageLabel = imageUpload.file?.name ??
    (isEdit && (initialData?.hasImage || initialData?.imageUrl) && !removedCurrentImage
      ? (initialData.imageFilename ?? "Current Image") : "No file chosen");

  const pdfLabel = pdfUpload.file?.name ??
    (isEdit && initialData?.hasPdf && !removedCurrentPdf
      ? (initialData.pdfFilename ?? "Current PDF") : "No file chosen");

  const showPdfSection = !(isEdit && initialData?.dataSource && initialData.dataSource !== "INTERNAL");

  return (
    <div className="container py-4">
      <form onSubmit={handleSubmit(onFormSubmit)} className="card shadow-sm border-0 rounded-4">
        <div className="card-header bg-white py-3 border-bottom">
          <h4 className="mb-0 fw-bold">{isEdit ? "Edit Book Details" : "Register New Book"}</h4>
        </div>

        <div className="card-body p-4">
          <div className="row g-4">

            <div className="col-lg-7 border-end pe-lg-4">
              <div className="row g-3">
                <div className="col-md-12">
                  <label className="form-label fw-semibold">Title</label>
                  <input
                    {...register("title", { required: "Title is required" })}
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Author</label>
                  <input
                    {...register("author", { required: "Author is required" })}
                    className={`form-control ${errors.author ? 'is-invalid' : ''}`}
                  />
                </div>

                {!isEdit && (
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Initial Copies</label>
                    <input type="number" {...register("copies", { min: 0 })} className="form-control" />
                  </div>
                )}

                <div className="col-12">
                  <CategorySelectField control={control} options={options} errors={errors} />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    {...register("description", { required: "Description is required" })}
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-5 ps-lg-4">
              <ImageUploadField
                uploadHook={imageUpload}
                isEdit={isEdit}
                hasInitialImage={initialData?.hasImage || initialData?.imageUrl}
                onRemove={setRemovedCurrentImage}
                imageLabel={imageLabel}
              />

              {showPdfSection && (
                <PdfUploadField
                  uploadHook={pdfUpload}
                  isEdit={isEdit}
                  hasInitialPdf={initialData?.hasPdf}
                  onRemove={setRemovedCurrentPdf}
                  pdfLabel={pdfLabel}
                />
              )}

              <div className="mt-5 pt-3">
                <button className="btn btn-dark btn-lg w-100 rounded-pill shadow-sm" type="submit">
                  {isEdit ? "Update Master Record" : "Add to Library"}
                </button>
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
};