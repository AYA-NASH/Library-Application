import { useEffect, useState } from "react";

interface UseImageUploadOptions {
    maxSizeMB?: number;
    allowedTypes?: string[];
}

export function useImageUpload(options?: UseImageUploadOptions) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const maxSizeMB = options?.maxSizeMB ?? 5;
    const allowedTypes = options?.allowedTypes ?? ["image/jpeg", "image/png", "image/webp"];

    function selectFile(selectedFile: File) {
        if (!allowedTypes.includes(selectedFile.type)) {
            setError("Only JPG, PNG, or WEBP images are allowed.");
            return;
        }

        const maxBytes = maxSizeMB * 1024 * 1024;
        if (selectedFile.size > maxBytes) {
            setError(`Image size must be less than ${maxSizeMB}MB.`);
            return;
        }

        setError(null);
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    }

    function clearFile() {
        setFile(null);
        setPreview(null);
        setError(null);
    }

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    return {
        file,
        preview,
        error,
        selectFile,
        clearFile,
    };
}
