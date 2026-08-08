import { BookModel } from "@/models/BookModel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    EditIcon,
    EllipsisVertical,
    TrashIcon
} from "lucide-react";
import defaultBookImg from "@/Images/BooksImages/book_cover_default_dark.png";
import { useState } from "react";
import { EditBookModal } from "../EditBookModal";
import { DeleteBook } from "../DeleteBook";
import { getBookStatusConfig } from "@/constants/admin-dashboard/books/bookTableHelpers";

interface BookInformationProps {
    book: BookModel
}
export function BookInformation({ book }: BookInformationProps) {
    const bookStatus = getBookStatusConfig(book.status);

    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
        <Card>
            <CardContent className="flex gap-5 p-5">
                <img
                    src={book.img || defaultBookImg}
                    alt={book.title}
                    className="h-32  w-22 shrink-0 rounded-lg border object-cover bg-muted"
                />

                <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <CardTitle className="text-xl">
                                {book.title}
                            </CardTitle>

                            <p className="mt-1 text-sm font-medium text-muted-foreground">
                                {book.author}
                            </p>
                        </div>

                        <Badge
                            className={`${bookStatus?.variant} shrink-0`}
                        >
                            {book.status}
                        </Badge>

                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="shrink-0"
                                    >
                                        <EllipsisVertical className="h-4 w-4" />
                                    </Button>
                                }
                            />

                            <DropdownMenuContent className="w-40! pt-4">
                                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                                    <EditIcon className="mr-2 h-4 w-4" />
                                    Edit Information
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
                                    <TrashIcon className="mr-2 h-4 w-4" />
                                    Delete Book
                                </DropdownMenuItem>

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {book.categories && book.categories?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {book.categories.map((cat) => (
                                <Badge
                                    key={cat.id}
                                    variant="secondary"
                                >
                                    {cat.name}
                                </Badge>
                            ))}
                        </div>
                    )}

                    <CardDescription
                        className="mt-4 line-clamp-3 leading-6"
                    >
                        {book.description || "No description available."}
                    </CardDescription>
                </div>

                <EditBookModal
                    book={book}
                    open={editOpen}
                    onOpenChange={setEditOpen}
                />

                <DeleteBook
                    bookName={book.title}
                    bookId={book.id}
                    open={deleteOpen}
                    onOpenChange={setDeleteOpen}
                />
            </CardContent>
        </Card>
    )
}