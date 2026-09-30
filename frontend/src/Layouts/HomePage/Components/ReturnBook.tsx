import { FC } from "react";
import { Link } from "react-router-dom";
import placeholder from "@/Images/BooksImages/book-luv2code-1000.png";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookModel } from "@/models/BookModel";

export const ReturnBook: FC<{ book: BookModel }> = (props) => {
    const { id, img, title, author } = { ...props.book };
    return (
        <Card className="flex h-full flex-col overflow-hidden text-center">
            <CardHeader className="flex-none pb-4">
                <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
                <CardDescription className="line-clamp-1">{author}</CardDescription>
            </CardHeader>

            <CardContent className="flex grow items-center justify-center p-6 pt-0">
                <img
                    src={img || placeholder}
                    alt={`Cover of ${title}`}
                    className="h-58.25 w-37.75 rounded-md object-cover shadow-md"
                />
            </CardContent>

            <div className="flex-none justify-center pb-6">
                <Button className="w-full max-w-50" render={
                    <Link to={`checkout/${id}`}>
                        Reserve
                    </Link>
                } />

            </div>
        </Card>
    );
};
