import { useCategories } from "../../../Hooks/BookHooks/useCategories";
import { Check, X, PencilSquare, Trash, PlusCircle } from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import "../styles/Categories.css";
import { ConfirmAction } from "../../Utils/ConfirmAction";

export const Categories = () => {
    const {
        categories,
        setCategories,
        httpError,
        setHttpError,
        isLoading,
        setIsLoading,
        createCategory,
        updateCategory,
        deleteCategory,
        fetchBooksCountByCategory
    } = useCategories();

    // Category Creation
    const [categoryName, setCategoryName] = useState("");
    const [showModal, setShowModal] = useState(false);

    // Category Inline Editing
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");

    // Category Deletion
    const [booksCount, setBooksCount] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleCloseModal = () => {
        setShowModal(false);
        setCategoryName("");
        setHttpError(null);
    };

    const handleAddCategory = async () => {
        if (!categoryName.trim()) return;

        setIsLoading(true);
        try {
            const newCategory = await createCategory(categoryName);

            setCategories((prev) => [...prev, {
                ...newCategory
            }]);

            handleCloseModal();
        } catch (error: any) {
            setHttpError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = (category: any) => {
        setEditingId(category.id);
        setEditName(category.name);
    }

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditName("");
    };

    const handleUpdate = async (id: number) => {
        if (!editName.trim()) return;
        setIsLoading(true);
        try {
            const updated = await updateCategory(id, editName);
            setCategories(prev => prev.map(c => c.id === id ? { ...c, name: updated.name } : c));
            setEditingId(null);
        } catch (err: any) {
            setHttpError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (category: any) => {
        setDeletingId(category.id);
        setBooksCount(null);
        setShowDeleteConfirm(true);
    };

    useEffect(() => {
        if (showDeleteConfirm && deletingId !== null) {
            fetchBooksCountByCategory(deletingId)
                .then(count => setBooksCount(count))
                .catch(() => setBooksCount(0));
        }
    }, [showDeleteConfirm, deletingId]);

    const confirmDeleteCategory = async () => {
        if (deletingId === null) return;

        setIsDeleting(true);
        try {
            await deleteCategory(deletingId);
            setCategories(prev => prev.filter(c => c.id !== deletingId));
            setShowDeleteConfirm(false);
            setDeletingId(null);
        } catch (error: any) {
            setHttpError(error.message);
            setShowDeleteConfirm(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setDeletingId(null);
        setBooksCount(null);
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '900px' }}>
            <div className="d-flex justify-content-between align-items-end mb-4">
                <h4 className="fw-bold m-0">Library Categories</h4>
                <button className="btn btn-gold-outline" onClick={() => setShowModal(true)}>
                    <PlusCircle className="gold-icon" size={20} />
                    <span className="ms-2">Add Category</span>
                </button>
            </div>

            {httpError && !showModal && (
                <div className="alert alert-danger">{httpError}</div>
            )}

            <div className="mt-4 category-table-container border">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th className="ps-4 py-3">Category Name</th>
                            <th className="pe-4 py-3 text-end">Management</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>
                                    {editingId === category.id ? (
                                        <input
                                            type="text"
                                            className="form-control form-control-sm w-75"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            autoFocus
                                        />
                                    ) : (
                                        <>
                                            <span className="fw-semibold">{category.name}</span>
                                            <small className="text-muted ms-2">({category.booksCount} books)</small>
                                        </>
                                    )}
                                </td>
                                <td className="text-end">
                                    {editingId === category.id ? (
                                        <>
                                            <button className="btn btn-sm btn-success me-2" onClick={() => handleUpdate(category.id)}>
                                                <Check size={18} />
                                            </button>
                                            <button className="btn btn-sm btn-light" onClick={handleCancelEdit}>
                                                <X size={18} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="btn-icon-circle me-1" onClick={() => handleEditClick(category)}>
                                                <PencilSquare size={18} />
                                            </button>
                                            <button
                                                className="btn-icon-circle btn-icon-circle-danger ms-1"
                                                onClick={() => handleDeleteClick(category)}
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Category</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>

                            <div className="modal-body">
                                {httpError && (
                                    <div className="alert alert-danger" role="alert">
                                        {httpError}
                                    </div>
                                )}

                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleAddCategory();
                                }}
                                >
                                    <div className="mb-3">
                                        <label htmlFor="categoryName" className="form-label">Category Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="categoryName"
                                            value={categoryName}
                                            onChange={(e) => setCategoryName(e.target.value)}
                                            disabled={isLoading}
                                            autoFocus
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-gold-outline"
                                    onClick={handleAddCategory}
                                    disabled={isLoading || !categoryName.trim()}
                                >
                                    {isLoading ? "Saving..." : "Add Category"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmAction
                show={showDeleteConfirm}
                title="Delete Category"
                message={
                    booksCount === null
                        ? "Calculating associated books..."
                        : `There are ${booksCount} books in this category. Are you sure you want to delete it?`
                }
                confirmText="Delete"
                isProcessing={isDeleting}
                onConfirm={confirmDeleteCategory}
                onCancel={cancelDelete}
            />
        </div>
    );
};