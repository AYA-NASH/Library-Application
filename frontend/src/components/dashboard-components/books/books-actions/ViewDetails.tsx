import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    BookOpen} from "lucide-react";
import { BookModel } from "@/models/BookModel";
import { BookInformation } from "./book-details/BookInformation";
import { BookInventory } from "./book-details/BookInventory";


interface ViewDetailsProps {
    book: BookModel;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ViewDetails({ book, open, onOpenChange }: ViewDetailsProps) {

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[42vw]! max-w-[42vw]! overflow-y-auto p-0">

                <SheetHeader className="flex flex-row items-center border-b px-6">
                    <BookOpen className="rounded-lg text-accent-foreground p-4 h-14 w-14" />
                    <SheetTitle>Book Details</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 p-6">
                    <BookInformation book={book} />

                    <BookInventory book={book} />
                </div>

            </SheetContent>
        </Sheet>
    );
}