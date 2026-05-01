export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
}

export interface PageParams{
    size: number;
    page: number;
}
