export interface CategoryDetails {
    id: number;
    name: string;
    booksCount?: number;
}

export interface CategoryCreateRequest {
    name: string;
}

export interface CategoryReference {
    id: number;
    name: string;
}
