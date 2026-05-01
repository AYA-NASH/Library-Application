import { useRef } from "react";
import { PdfUploadFieldProps } from "../../../types/book-form";

export const PdfUploadField: React.FC<PdfUploadFieldProps> = ({
    uploadHook,
    isEdit,
    hasInitialPdf,
    onRemove,
    pdfLabel,
}) => {
    const pdfInputRef = useRef<HTMLInputElement | null>(null);

    const handleClear = () => {
        uploadHook.clearFile();
        if (isEdit && hasInitialPdf) {
            onRemove(true);
        }
        if (pdfInputRef.current) pdfInputRef.current.value = "";
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadHook.selectFile(file);
            onRemove(false);
        }
    };

    return (
        <div className="p-3 rounded-4 bg-light border border-2 border-dashed">
            <label className="form-label fw-bold d-block mb-3">
                Book Document (PDF) {!isEdit && <span className="text-danger">*</span>}
            </label>

            <div className="d-flex flex-wrap align-items-center gap-2">
                <input
                    type="file"
                    accept="application/pdf"
                    ref={pdfInputRef}
                    className="d-none"
                    onChange={handleFileChange}
                />

                <button
                    type="button"
                    className="btn btn-outline-primary btn-sm rounded-pill px-3"
                    onClick={() => pdfInputRef.current?.click()}
                >
                    <i className="bi bi-upload me-2"></i>
                    Upload PDF
                </button>

                <span className="text-muted small text-truncate" style={{ maxWidth: "200px" }}>
                    {pdfLabel}
                </span>

                {(uploadHook.file || (isEdit && hasInitialPdf)) && (
                    <button
                        type="button"
                        className="btn btn-link btn-sm text-danger p-0 ms-2 text-decoration-none"
                        onClick={handleClear}
                    >
                        Remove
                    </button>
                )}
            </div>

            <div className="mt-2">
                <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Maximum size: 50MB
                </small>
                {uploadHook.error && (
                    <div className="text-danger small mt-1">{uploadHook.error}</div>
                )}
            </div>
        </div>
    );
};