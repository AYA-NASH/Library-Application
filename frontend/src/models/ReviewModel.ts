export interface ReviewModel {
    id: number;
    userEmail: string;
    date: string;
    bookId: number;
    rating: number;
    reviewDescription?: string;
}

export interface ReviewRequest {
    rating: number;
    reviewDescription?: string;
}