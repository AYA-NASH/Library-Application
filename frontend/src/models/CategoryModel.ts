export class CategoryModel{
    id: number;
    name: string;
    booksCount?: number;

    constructor(id: number, name: string, booksCount?: number){
        this.id = id;
        this.name = name;
        this.booksCount = booksCount;
    }
}
