import { useEffect, useState } from "react";

interface useFileUploadOptions {
    maxSizeMB?: number;
    allowedTypes: string[];
    initialFileUrl?: string;
}

export function useFileUpload(options: useFileUploadOptions) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(options?.initialFileUrl ?? null);
    const [error, setError] = useState<string | null>(null);

    const maxSizeMB = options?.maxSizeMB ?? 5;

    function selectFile(selectedFile: File) {
        if (!options.allowedTypes.includes(selectedFile.type)) {
            setError(`Invalid file type. Allowed: ${options.allowedTypes.join(", ")}`);
            return;
        }

        const maxBytes = maxSizeMB * 1024 * 1024;
        if (selectedFile.size > maxBytes) {
            setError(`File size must be less than ${maxSizeMB}MB.`);
            return;
        }

        setError(null);
        setFile(selectedFile);
        
        if (selectedFile.type.startsWith("image/")) {
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setPreview(null);
        }
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
    }, [file, preview]);

    return {
        file,
        preview,
        error,
        selectFile,
        clearFile,
        setPreview,
    };
}
