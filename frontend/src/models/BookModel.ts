export class BookModel {
    id: number;
    title: string;
    status: string;
    author?: string;
    description?: string;
    copies?: number;
    copiesAvailable?: number;
    categories?: { id: number; name: string }[];
    dataSource: string;
    img?: string;

    constructor(id: number, title: string,
        status: string,
        description: string, author: string,
        copies: number,
        copiesAvailable: number,
        dataSource: string, img: string,
        categories?: { id: number; name: string }[],
    ) {

        this.id = id;
        this.title = title;
        this.status = status;
        this.description = description;
        this.author = author;
        this.copies = copies;
        this.copiesAvailable = copiesAvailable;
        this.categories = categories;
        this.dataSource = dataSource;
        this.img = img;
    }
};