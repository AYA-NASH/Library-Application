import { useRef, useState } from "react";
import { BookModel } from "../../../models/BookModel";
import { useImageUpload } from "../../Hooks/useUploadImage";

interface BookFormProps {
  isEdit: boolean;
  initialData?: BookModel;
  onSubmit: (formData: FormData) => void;
}

export const BookForm: React.FC<BookFormProps> = ({ isEdit, initialData, onSubmit }) => {

  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    author: initialData?.author ?? "",
    description: initialData?.description ?? "",
    category: initialData?.category ?? "Category",
    copies: initialData?.copies ?? 0,
    image: initialData?.img ?? null
  });

  const [displayWarning, setDisplayWarning] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);


  const {
    file: selectedImage,
    preview: imagePreview,
    error: imageError,
    selectFile,
    clearFile,
  } = useImageUpload({ maxSizeMB: 5, initialImageUrl: initialData?.img });

  const categoryOptions = ["Front End", "Back End", "Data", "DevOps"];

  const handleChange = (field: string, value: string | number) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    const formData = new FormData();

    if (!isEdit) {
      if (
        !form.title ||
        !form.author ||
        !form.description ||
        form.category === "Category" ||
        form.copies < 0
      ) {
        setDisplayWarning(true);
        return;
      }

      formData.append("title", form.title);
      formData.append("author", form.author);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("copies", form.copies.toString());

    } else if (isEdit && initialData) {
      if (form.title !== initialData.title) formData.append("title", form.title);
      if (form.author !== initialData.author) formData.append("author", form.author);

      if (form.description !== initialData.description)
        formData.append("description", form.description);

      if (form.category !== initialData.category)
        formData.append("category", form.category);

    }

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    setDisplayWarning(false);
    onSubmit(formData);
  };

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
              ></textarea>
            </div>

            <div className="col-12">
              <label className="form-label">Book Image</label>
              <div className="d-flex align-items-center">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      selectFile(e.target.files[0]);
                    }
                  }}
                />

                <label
                  htmlFor="book-image-upload"
                  className="btn btn-outline-dark me-2 mb-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose Image
                </label>

                {selectedImage && (
                  <span className="text-truncate" style={{ maxWidth: "200px" }}>
                    {selectedImage.name}
                  </span>
                )}
              </div>

              {imageError && (
                <div className="alert alert-danger mt-2 py-1">{imageError}</div>
              )}

              {imagePreview && (
                <div
                  className="position-relative mt-3 d-inline-block"
                  style={{
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    border: "1px solid #ddd",
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="Book preview"
                    className="img-fluid"
                    style={{ maxWidth: "200px", maxHeight: "300px", objectFit: "cover" }}
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
                      clearFile();
                      handleChange("image", "");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <div className="col-12 mt-3">
              <button className="btn btn-primary" type="button" onClick={handleSubmit}>
                {isEdit ? "Update Book" : "Add Book"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}