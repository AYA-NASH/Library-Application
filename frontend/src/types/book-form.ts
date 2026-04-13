export interface ImageUploadFieldProps {
    uploadHook: any;
    isEdit: boolean;
    hasInitialImage: boolean | string | undefined;
    onRemove: (removed: boolean) => void;
    imageLabel: string;
}

export interface PdfUploadFieldProps {
    uploadHook: any;
    isEdit: boolean;
    hasInitialPdf: boolean | undefined;
    onRemove: (removed: boolean) => void;
    pdfLabel: string;
}

export interface IBookFormInputs {
    title: string;
    author: string;
    description: string;
    categoryIds: number[];
    copies: number;
}
