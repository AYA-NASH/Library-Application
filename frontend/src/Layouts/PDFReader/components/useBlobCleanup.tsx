import { useEffect } from "react";

export const useBlobCleanup = (fileUrl: string) => {
    useEffect(() => {

        return () => {
            if (fileUrl.startsWith("blob:")) {
                window.URL.revokeObjectURL(fileUrl);
                console.log("Memory Released: PDF Blob URL revoked.");
            }
        };
    }, [fileUrl]);
};