export class ReviewModel{
    id: number;
    userEmail: string;
    date: string;
    bookId: number;
    rating: number;
    rate: number;
    reviewDescription?: string;

    constructor(id:number, userEmail:string, date:string, bookId:number, rating:number, rate:number, reviewDescription: string){
        this.id = id;
        this.userEmail = userEmail;
        this.date = date;
        this.bookId = bookId;
        this.rating = rating;
        this.rate = rate;
        this.reviewDescription = reviewDescription;
    }

}