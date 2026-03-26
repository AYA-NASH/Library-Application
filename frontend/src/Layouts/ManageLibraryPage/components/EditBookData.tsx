import { useEffect, useState } from "react";
import { BookModel } from "../../../models/BookModel";
import defaultBookImg from "../../../Images/BooksImages/book_cover_default_dark.png";
import { BookForm } from "./BookForm";

import { useAdminBooks } from "../../../Hooks/BookHooks/useAdminBooks";

import type {
  AdminBookRequest,

} from "../../../models/AdminBookRequest";

export const EditBookData: React.FC<{
  book: BookModel;
  updateBook: () => void;
}> = (props) => {

  const [showModal, setShowModal] = useState(false);

  const [editInitialData, setEditInitialData] = useState<AdminBookRequest | null>(null);
  const [editInfoLoading, setEditInfoLoading] = useState(false);
  const [editInfoError, setEditInfoError] = useState<string | null>(null);

  const { updateBook, fetchEditInfo } = useAdminBooks();

  useEffect(() => {
    if (!showModal || !props.book) return;

    const categories = props.book.categories?.map((cat) => cat.id);

    const baseInitial: AdminBookRequest = {
      id: props.book.id,
      title: props.book.title,
      author: props.book.author ?? "",
      description: props.book.description ?? "",
      copies: props.book.copies ?? 0,
      categoryIds: categories ?? [],
      dataSource: props.book.dataSource,
      imageUrl: props.book.img,
    };

    fetchEditInfo(props.book.id).then((editInfo) => {
      if (editInfo) {
        setEditInitialData({
          ...baseInitial,
          hasPdf: editInfo.hasPdf,
          hasImage: editInfo.hasImage,
          imageUrl: editInfo.imageUrl ?? props.book.img,
          pdfFilename: editInfo.pdfFilename,
          imageFilename: editInfo.imageFilename,
        });
      } else {
        setEditInitialData({ ...baseInitial });
      }
    });
  }, [showModal, props.book, fetchEditInfo]);

  const handleCloseModal = () => {
    setShowModal(false);
    setEditInitialData(null);
    setEditInfoError(null);
  };

  const handleUpdateDetails = async (formData: FormData) => {
    try {
      const success = await updateBook(props.book.id, formData);
      if (success) {
        handleCloseModal();
        props.updateBook()
      };
    } catch (error) {
      alert("Error updating book");
    }
  };

  return (
    <div className="p-3 position-relative">
      <button
        className="btn btn-light btn-sm position-absolute top-0 end-0 m-2 rounded-circle shadow-sm border"
        onClick={() => setShowModal(true)}
        title="Edit Book Details"
      >
        <span style={{ color: "#6c757d" }}>✎</span>
      </button>

      <div className="row g-0">
        <div className="col-md-3">
          <img
            src={props.book.img ? props.book.img : defaultBookImg}
            width="123"
            height="196"
            alt="book"
            className="rounded shadow-sm"
          />
        </div>

        <div className="col-md-9 d-flex flex-column justify-content-center">
          <p className="text-primary mb-1 fw-bold">{props.book.author}</p>
          <h3 className="card-title mb-2">{props.book.title}</h3>
          <div className="mt-2">
            <p className="rounded-pill bg-info text-dark px-3 py-1 d-inline-block">
              {props.book.categories?.map((cat) => cat.name).join(", ") || "No Category"}
            </p>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-12">
          <p
            className="card-text text-secondary"
            style={{ fontSize: "0.95rem", lineHeight: "1.6" }}
          >
            {props.book.description}
          </p>
        </div>
      </div>

      {showModal && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">Edit Book Details</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseModal}
                />
              </div>

              <div className="modal-body p-4">
                {editInfoLoading && (
                  <div className="text-center py-4">Loading…</div>
                )}
                {editInfoError && (
                  <div className="alert alert-warning mb-3">
                    {editInfoError}. You can still edit and save.
                  </div>
                )}
                {editInitialData && !editInfoLoading && (
                  <BookForm
                    isEdit
                    initialData={editInitialData}
                    onSubmit={handleUpdateDetails}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
