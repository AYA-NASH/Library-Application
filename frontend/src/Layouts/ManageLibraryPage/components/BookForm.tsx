import { useMemo, useRef, useState } from "react";
import { useFileUpload } from "../../Hooks/useFileUpload";
import type { AdminBookRequest } from "../../../models/AdminBookRequest";
import { useCategories } from "../../../Hooks/BookHooks/useCategories";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";

interface BookFormProps {
  isEdit: boolean;
  initialData?: AdminBookRequest;
  onSubmit: (formData: FormData) => void;
}

interface IBookFormInputs {
  title: string;
  author: string;
  description: string;
  categoryIds: number[];
  copies: number;
}

export const BookForm: React.FC<BookFormProps> = ({ isEdit, initialData, onSubmit }) => {
  const { categories } = useCategories();

  const { control, register, handleSubmit, formState: { errors } } = useForm<IBookFormInputs>({
    defaultValues: {
      title: initialData?.title ?? "",
      author: initialData?.author ?? "",
      description: initialData?.description ?? "",
      categoryIds: initialData?.categoryIds ?? [],
      copies: initialData?.copies ?? 0,
    }
  });

  const [removedCurrentPdf, setRemovedCurrentPdf] = useState(false);
  const [removedCurrentImage, setRemovedCurrentImage] = useState(false);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);

  const imageUpload = useFileUpload({
    maxSizeMB: 5,
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    initialFileUrl: initialData?.imageUrl,
  });

  const pdfUpload = useFileUpload({
    maxSizeMB: 50,
    allowedTypes: ["application/pdf"],
    initialFileUrl: undefined,
  });

  const options = useMemo(() =>
    categories.map(cat => ({ value: cat.id, label: cat.name })),
    [categories]);

  const showPdfLoad = !(isEdit && initialData?.dataSource && initialData.dataSource !== "INTERNAL");

  const onFormSubmit = (data: IBookFormInputs) => {
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

    if (imageUpload.file) formData.append("image", imageUpload.file);
    if (pdfUpload.file) formData.append("pdf", pdfUpload.file);

    if (isEdit) {
      if (removedCurrentImage && !imageUpload.file) formData.append("removeImage", "true");
      if (removedCurrentPdf && !pdfUpload.file) formData.append("removePdf", "true");
    }

    onSubmit(formData);
  };

  const pdfLabel = (pdfUpload.file?.name) ?? (
    isEdit && initialData?.hasPdf && !removedCurrentPdf
      ? (initialData.pdfFilename ?? "Current PDF")
      : "No file chosen"
  );

  const imageLabel = (imageUpload.file?.name) ?? (
    isEdit && (initialData?.hasImage ?? initialData?.imageUrl) && !removedCurrentImage
      ? (initialData.imageFilename ?? "Current Image")
      : "No file chosen"
  );

  return (
    <div className="container mt-3">

      <form onSubmit={handleSubmit(onFormSubmit)} className="card shadow-sm">
        <div className="card-header">{isEdit ? "Edit Book" : "Add a New Book"}</div>

        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Title</label>
              <input
                {...register("title", { required: "Title is required" })}
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Author</label>
              <input
                {...register("author", { required: "Author is required" })}
                className={`form-control ${errors.author ? 'is-invalid' : ''}`}
              />
            </div>

            {!isEdit && (
              <div className="col-md-6">
                <label className="form-label">Copies</label>
                <input
                  type="number"
                  {...register("copies", { min: 0 })}
                  className="form-control"
                />
              </div>
            )}

            <div className="col-md-6">
              <label className="form-label">Categories</label>
              <Controller
                name="categoryIds"
                control={control}
                rules={{ required: "Select at least one category" }}
                render={({ field: { onChange, value, ref } }) => (
                  <Select
                    ref={ref}
                    isMulti
                    options={options}
                    value={options.filter(opt => (value || []).includes(opt.value))}
                    onChange={(val) => {
                      onChange(val ? val.map(c => c.value) : []);
                    }}
                    placeholder="Search and select categories..."
                    classNamePrefix="react-select"
                    className={errors.categoryIds ? 'is-invalid' : ''}
                  />
                )}
              />
              {errors.categoryIds && <small className="text-danger">{errors.categoryIds.message}</small>}
            </div>

            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea
                {...register("description", { required: "Description is required" })}
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                rows={3}
              />
            </div>

            <div className="row g-4 mt-2">
              <div className="col-md-6">
                <label className="form-label fw-bold">Book Cover Image</label>

                <div className="d-flex align-items-center mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    ref={imageInputRef}
                    className="d-none"
                    onChange={(e) =>
                      e.target.files?.[0] && imageUpload.selectFile(e.target.files[0])
                    }
                  />

                  <button
                    type="button"
                    className="btn btn-outline-dark me-2"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    Choose Image
                  </button>

                  <span
                    className="text-muted small text-truncate"
                    style={{ maxWidth: "150px" }}
                  >
                    {imageLabel}
                  </span>
                </div>

                {imageUpload.error && (
                  <div className="text-danger small">{imageUpload.error}</div>
                )}

                {imageUpload.preview && (
                  <div
                    className="position-relative mt-3 d-inline-block"
                    style={{
                      borderRadius: "0.5rem",
                      overflow: "hidden",
                      border: "1px solid #ddd",
                    }}
                  >
                    <img
                      src={imageUpload.preview}
                      alt="Book preview"
                      className="img-fluid"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "300px",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 p-0 d-flex justify-content-center align-items-center"
                      style={{
                        width: "25px",
                        height: "25px",
                        borderRadius: "50%",
                        fontWeight: "bold",
                        lineHeight: "1",
                      }}
                      onClick={() => {
                        imageUpload.clearFile();
                        if (isEdit && (initialData?.hasImage ?? initialData?.imageUrl)) setRemovedCurrentImage(true);
                        if (imageInputRef.current) imageInputRef.current.value = "";
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              {showPdfLoad && (
                <div className="col-md-6 border-start">
                  <label className="form-label fw-bold">
                    Book File (PDF) {!isEdit && <span className="text-danger">*</span>}
                  </label>
                  <div className="d-flex align-items-center mb-2">
                    <input
                      type="file"
                      accept="application/pdf"
                      ref={pdfInputRef}
                      className="d-none"
                      onChange={(e) =>
                        e.target.files?.[0] && pdfUpload.selectFile(e.target.files[0])
                      }
                    />
                    <button
                      type="button"
                      className="btn btn-outline-dark me-2"
                      onClick={() => pdfInputRef.current?.click()}
                    >
                      Upload PDF
                    </button>
                    <span
                      className="text-muted small text-truncate"
                      style={{ maxWidth: "150px" }}
                    >
                      {pdfLabel}
                    </span>

                    {(pdfUpload.file || (isEdit && initialData?.hasPdf && !removedCurrentPdf)) && (
                      <button
                        type="button"
                        className="btn btn-sm text-danger ms-1"
                        onClick={() => {
                          pdfUpload.clearFile();
                          if (isEdit && initialData?.hasPdf) setRemovedCurrentPdf(true);
                          if (pdfInputRef.current) pdfInputRef.current.value = "";
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <small className="text-muted d-block">Max size: 50MB</small>
                  {pdfUpload.error && (
                    <div className="text-danger small">{pdfUpload.error}</div>
                  )}
                </div>
              )}
            </div>

            <div className="col-12 mt-4 pt-3 border-top">
              <button className="btn btn-dark btn-lg w-100" type="submit">
                {isEdit ? "Update Book Details" : "Add New Book to Library"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
