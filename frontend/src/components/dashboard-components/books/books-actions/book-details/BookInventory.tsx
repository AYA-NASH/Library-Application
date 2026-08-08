import { BookModel } from "@/models/BookModel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    DockIcon,
    EditIcon,
    EllipsisVertical,
    Monitor,
    TicketCheck
} from "lucide-react";
import { useState } from "react";
import { getBookStatusConfig } from "@/constants/admin-dashboard/books/bookTableHelpers";
import { ManageInventoryDialog } from "./ManageInventoryDialog";

interface BookInventoryProps {
    book: BookModel
}

export function BookInventory({ book }: BookInventoryProps) {
    const [openDialog, setOpenDialog] = useState(false);
    const bookStatus = getBookStatusConfig(book.status);

    const [quantity, setQuantity] = useState<number>(() => book.copies ?? 0);
    const [remaining, setRemaining] = useState<number>(() => book.copiesAvailable ?? 0);

    const handleInventoryUpdated = (
        newQuantity: number,
        newRemaining: number
    ) => {
        setQuantity(newQuantity);
        setRemaining(newRemaining);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                    <CardTitle>Inventory Summary</CardTitle>
                    <CardDescription>
                        Current inventory and circulation.
                    </CardDescription>
                </div>

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

                    <DropdownMenuContent className="w-60! p-2">
                        <DropdownMenuItem onClick={() => setOpenDialog(true)}>
                            <EditIcon className="mr-2 h-4 w-4" />
                            Manage Inventory
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>

            <CardContent className="space-y-6">
                <div
                    className={`rounded-xl border p-4 ${bookStatus?.variant}`}
                >
                    <Badge variant="secondary">
                        {book.status}
                    </Badge>
                    <p className="mt-2 text-sm font-medium">
                        {bookStatus?.description}
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-xl border p-4 text-center">
                        <DockIcon className="mx-auto mb-3 h-5 w-5 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            Total Copies
                        </p>
                        <p className="mt-2 text-3xl font-bold">
                            {quantity}
                        </p>
                    </div>

                    <div className="rounded-xl border p-4 text-center">
                        <TicketCheck className="mx-auto mb-3 h-5 w-5 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            Borrowed
                        </p>
                        <p className="mt-2 text-3xl font-bold">
                            {quantity - remaining}
                        </p>
                    </div>

                    <div className="rounded-xl border p-4 text-center">
                        <Monitor className="mx-auto mb-3 h-5 w-5 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            Available
                        </p>
                        <p className="mt-2 text-3xl font-bold">
                            {remaining}
                        </p>
                    </div>
                </div>
            </CardContent>

            <ManageInventoryDialog
                originalQuantity={quantity}
                originalRemaining={remaining}
                bookId={book.id}
                open={openDialog}
                onOpenChange={setOpenDialog}
                onUpdated={handleInventoryUpdated}
            />
        </Card>
    )
}