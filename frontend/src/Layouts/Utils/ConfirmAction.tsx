import React from "react";

interface ConfirmActionProps {
    show: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isProcessing?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmAction: React.FC<ConfirmActionProps> = ({
    show,
    title = "Confirm Action",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isProcessing = false,
    onConfirm,
    onCancel
}) => {
    if (!show) return null;

    return (
        <>
            <div
                className="modal fade show d-block"
                tabIndex={-1}
                style={{ zIndex: 1055 }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content shadow-sm">
                        
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onCancel}
                                disabled={isProcessing}
                            />
                        </div>

                        <div className="modal-body">
                            <p className="mb-0">{message}</p>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={onCancel}
                                disabled={isProcessing}
                            >
                                {cancelText}
                            </button>

                            <button
                                className="btn btn-danger btn-sm"
                                onClick={onConfirm}
                                disabled={isProcessing}
                            >
                                {isProcessing && (
                                    <span className="spinner-border spinner-border-sm me-2" />
                                )}
                                {confirmText}
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <div
                className="modal-backdrop fade show"
                style={{ zIndex: 1050 }}
            />
        </>
    );
};
