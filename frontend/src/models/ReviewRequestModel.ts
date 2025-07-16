class ReviewRequestModel {
    bookId: number;
    rating: number;
    reviewDescription?: string;
    
    constructor(bookId:number, rating:number, reviewDescription?: string){
        this.rating = rating;
        this.bookId = bookId;
        this.reviewDescription = reviewDescription;
    }
}

export default ReviewRequestModel;