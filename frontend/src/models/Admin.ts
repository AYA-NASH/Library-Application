export interface AdminBookRequest {
    id?: number;
    title: string;
    author: string;
    description: string;
    copies: number;
    categoryIds: number[];
    dataSource?: string;
    hasPdf?: boolean;
    hasImage?: boolean;
    imageUrl?: string;
    pdfFilename?: string;
    imageFilename?: string;
}

export interface AdminBookEditInfoResponse {
    hasPdf: boolean;
    hasImage: boolean;
    imageUrl?: string;
    pdfFilename?: string;
    imageFilename?: string;
}

export interface AdminMessageRequest {
    id: number;
    response: string;
}