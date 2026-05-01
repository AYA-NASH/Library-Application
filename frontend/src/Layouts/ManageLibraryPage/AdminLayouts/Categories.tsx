import { useCategories, useCreateCategory, useDeleteCategory, useGetBookCountByCategory, useUpdateCategory } from "../../../api/hooks/BookHooks/useCategories";
import { Check, X, PencilSquare, Trash, PlusCircle } from "react-bootstrap-icons";
import { useState } from "react";
import "../styles/Categories.css";
import { ConfirmAction } from "../../Utils/ConfirmAction";
import { CategoryDetails } from "../../../models/CategoryModel";
import { toast } from "sonner";
import { ApiErrorDisplay } from "../../Utils/ApiErrorDisplay";
import { parseApiError } from "../../../errors/parseApiError";

export const Categories = () => {

    const { data, isLoading, isError, error } = useCategories(1, 20);

    const categories = data?.content ?? [];

    const createCategoryMutation = useCreateCategory();
    const updateCategoryMutation = useUpdateCategory();
    const deleteCategoryMutation = useDeleteCategory();

    // Category Creation
    const [categoryName, setCategoryName] = useState("");
    const [showModal, setShowModal] = useState(false);

    // Category Inline Editing
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");

    // Category Deletion
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const { data: booksCount } = useGetBookCountByCategory(
        deletingId ?? 0,
        showDeleteConfirm
    );

    const handleCloseModal = () => {
        setShowModal(false);
        setCategoryName("");
    };

    const handleAddCategory = () => {
        if (!categoryName.trim()) return;

        createCategoryMutation.mutate(
            { name: categoryName },
            {
                onSuccess: () => {
                    toast.success("Category created");
                    handleCloseModal();
                },
                onError: (err: any) => {
                    const apiError = parseApiError(err);
                    toast.error(apiError.message);
                }
            }
        );
    };

    const handleUpdate = (category: CategoryDetails) => {
        if (editName.trim() === category.name) return;
        updateCategoryMutation.mutate(
            {
                categoryId: category.id,
                requestBody: { name: editName }
            },
            {
                onSuccess: () => {
                    toast.success("Category updated");
                    setEditingId(null);
                },
                onError: (err: any) => {
                    const apiError = parseApiError(err);
                    toast.error(apiError.message);
                }
            }
        );
    };

    const handleEditClick = (category: CategoryDetails) => {
        setEditingId(category.id);
        setEditName(category.name);
    }

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditName("");
    };

    const handleDeleteClick = (category: CategoryDetails) => {
        setDeletingId(category.id);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteCategory = () => {
        if (deletingId === null) return;

        deleteCategoryMutation.mutate(deletingId, {
            onSuccess: () => {
                toast.success("Category deleted");
                setShowDeleteConfirm(false);
                setDeletingId(null);
            },
            onError: (err: any) => {
                const apiError = parseApiError(err);
                toast.error(apiError.message);
            }
        });
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setDeletingId(null);
    };

    if (isLoading) {
        return <div className="container mt-5">Loading...</div>;
    }

    if (isError) {
        return <ApiErrorDisplay error={error} title="Failed to load categories" />;
    }

    return (
        <div className="container mt-5" style={{ maxWidth: '900px' }}>
            <div className="d-flex justify-content-between align-items-end mb-4">
                <h4 className="fw-bold m-0">Library Categories</h4>
                <button className="btn btn-gold-outline" onClick={() => setShowModal(true)}>
                    <PlusCircle className="gold-icon" size={20} />
                    <span className="ms-2">Add Category</span>
                </button>
            </div>


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
                                            <small className="text-muted ms-2">
                                                ({category.booksCount} books)
                                            </small>
                                        </>
                                    )}
                                </td>
                                <td className="text-end">
                                    {editingId === category.id ? (
                                        <>
                                            <button
                                                className="btn btn-sm btn-success me-2"
                                                onClick={() => handleUpdate(category)}
                                                disabled={updateCategoryMutation.isPending}
                                            >
                                                <Check size={18} />
                                            </button>
                                            <button
                                                className="btn btn-sm btn-light"
                                                onClick={handleCancelEdit}
                                            >
                                                <X size={18} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="btn-icon-circle me-1"
                                                onClick={() => handleEditClick(category)}
                                            >
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
                                {createCategoryMutation.isError && (
                                    <div className="alert alert-danger">
                                        {parseApiError(createCategoryMutation.error).message}
                                    </div>
                                )}

                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleAddCategory();
                                    }}
                                >
                                    <div className="mb-3">
                                        <label className="form-label">Category Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={categoryName}
                                            onChange={(e) => setCategoryName(e.target.value)}
                                            disabled={createCategoryMutation.isPending}
                                            autoFocus
                                        />
                                    </div>
                                </form>
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn btn-gold-outline"
                                    onClick={handleAddCategory}
                                    disabled={
                                        createCategoryMutation.isPending ||
                                        !categoryName.trim()
                                    }
                                >
                                    {createCategoryMutation.isPending ? "Saving..." : "Add Category"}
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
                    booksCount === undefined
                        ? "Calculating associated books..."
                        : `There are ${booksCount} books in this category. Are you sure you want to delete it?`
                }
                confirmText="Delete"
                isProcessing={deleteCategoryMutation.isPending}
                onConfirm={confirmDeleteCategory}
                onCancel={cancelDelete}
            />
        </div>
    );
};