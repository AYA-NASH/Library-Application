import { useRef } from "react";
import { ImageUploadFieldProps } from "../../../types/book-form";

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
    uploadHook,
    isEdit,
    hasInitialImage,
    onRemove,
    imageLabel,
}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleClear = () => {
        uploadHook.clearFile();
        if (isEdit && hasInitialImage) {
            onRemove(true);
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadHook.selectFile(file);
            onRemove(false);
        }
    };

    return (
        <div className="mb-4">
            <label className="form-label fw-bold">Book Cover Image</label>

            <div className="d-flex align-items-center mb-2">
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="d-none"
                    onChange={handleFileChange}
                />

                <button
                    type="button"
                    className="btn btn-outline-dark me-2"
                    onClick={() => fileInputRef.current?.click()}
                >
                    Choose Image
                </button>

                <span className="text-muted small text-truncate" style={{ maxWidth: "200px" }}>
                    {imageLabel}
                </span>
            </div>

            {uploadHook.error && <div className="text-danger small mb-2">{uploadHook.error}</div>}

            {uploadHook.preview && (
                <div className="position-relative mt-3 d-inline-block border rounded shadow-sm overflow-hidden">
                    <img
                        src={uploadHook.preview}
                        alt="Preview"
                        style={{ maxWidth: "200px", maxHeight: "250px", objectFit: "cover" }}
                    />
                    <button
                        type="button"
                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                        style={{ borderRadius: "50%", width: "25px", height: "25px", padding: 0 }}
                        onClick={handleClear}
                    >
                        ×
                    </button>
                </div>
            )}
        </div>
    );
}