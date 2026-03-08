import { useRef, useState } from "react";
import { useFileUpload } from "../../Hooks/useFileUpload";
import type { AdminBookRequest } from "../../../models/AdminBookRequest";

interface BookFormProps {
  isEdit: boolean;
  initialData?: AdminBookRequest;
  onSubmit: (formData: FormData) => void;
}

export const BookForm: React.FC<BookFormProps> = ({ isEdit, initialData, onSubmit }) => {
  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    author: initialData?.author ?? "",
    description: initialData?.description ?? "",
    category: initialData?.category ?? "Category",
    copies: initialData?.copies ?? 0,
  });

  const [displayWarning, setDisplayWarning] = useState(false);

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

  const showPdfLoad = !(isEdit && initialData?.dataSource && initialData.dataSource !== "INTERNAL");
  const categoryOptions = ["Front End", "Back End", "Data", "DevOps"];

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const formData = new FormData();

    if (!isEdit) {
      const isBaseInfoMissing =
        !form.title ||
        !form.author ||
        !form.description ||
        form.category === "Category";

      if (isBaseInfoMissing) {
        setDisplayWarning(true);
        return;
      }

      formData.append("title", form.title);
      formData.append("author", form.author);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("copies", form.copies.toString());

    } else if (initialData) {
      if (form.title !== initialData.title) formData.append("title", form.title);
      if (form.author !== initialData.author) formData.append("author", form.author);
      if (form.description !== initialData.description)
        formData.append("description", form.description);
      if (form.category !== initialData.category)
        formData.append("category", form.category);
    }

    if (imageUpload.file) formData.append("image", imageUpload.file);
    if (pdfUpload.file) formData.append("pdf", pdfUpload.file);

    if (isEdit && removedCurrentImage && !imageUpload.file) formData.append("removeImage", "true");
    if (isEdit && removedCurrentPdf && !pdfUpload.file) formData.append("removePdf", "true");

    setDisplayWarning(false);
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
      {displayWarning && (
        <div className="alert alert-danger" role="alert">
          Please fill all required fields.
        </div>
      )}

      <div className="card">
        <div className="card-header">{isEdit ? "Edit Book" : "Add a New Book"}</div>

        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Author</label>
              <input
                type="text"
                className="form-control"
                value={form.author}
                onChange={(e) => handleChange("author", e.target.value)}
              />
            </div>

            {!isEdit && (
              <div className="col-md-6">
                <label className="form-label">Copies</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.copies}
                  onChange={(e) => handleChange("copies", Number(e.target.value))}
                />
              </div>
            )}

            <div className="col-md-6">
              <label className="form-label">Category</label>

              <button
                className="form-control btn btn-dark dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
              >
                {form.category}
              </button>

              <ul className="dropdown-menu">
                {categoryOptions.map((cat) => (
                  <li key={cat}>
                    <a
                      className="dropdown-item"
                      onClick={() => handleChange("category", cat)}
                    >
                      {cat}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={3}
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
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
              <button
                className="btn btn-dark btn-lg w-100"
                type="button"
                onClick={handleSubmit}
              >
                {isEdit ? "Update Book Details" : "Add New Book to Library"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
