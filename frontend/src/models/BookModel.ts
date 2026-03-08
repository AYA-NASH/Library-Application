export class BookModel{
    id: number;
    title: string;
    author?: string;
    description?: string;
    copies?: number;
    copiesAvailable?: number;
    category?: string;
    dataSource: string;
    img?:string;
    
    constructor(id: number, title: string, description: string, author: string, copies: number,
         copiesAvailable: number ,category: string, dataSource: string, img:string){

            this.id = id;
            this.title = title;
            this.description = description;
            this.author = author;
            this.copies = copies;
            this.copiesAvailable = copiesAvailable;
            this.category = category;
            this.dataSource = dataSource;
            this.img = img; 
    }
};