import { useUpdateBookQuantity } from "@/api/hooks/BookHooks/useAdminBooks";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ManageInventoryDialogProps {
    originalQuantity: number;
    originalRemaining: number;
    bookId: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdated: (quantity: number, remaining: number) => void;
}

export function ManageInventoryDialog({
    originalQuantity,
    originalRemaining,
    onUpdated,
    bookId,
    open,
    onOpenChange
}: ManageInventoryDialogProps) {
    const [quantity, setQuantity] = useState(originalQuantity);
    const [remaining, setRemaining] = useState(originalRemaining);

    const { mutate: updateQty, isPending: isUpdating } = useUpdateBookQuantity();

    useEffect(() => {
        if (open) {
            setQuantity(originalQuantity);
            setRemaining(originalRemaining);
        }
    }, [open, originalQuantity, originalRemaining]);

    function internalIncrease() {
        setQuantity(prev => prev + 1);
        setRemaining(prev => prev + 1);
    }

    function internalDecrease() {
        if (quantity > 0 && remaining > 0) {
            setQuantity(prev => prev - 1);
            setRemaining(prev => prev - 1);
        }
    }

    async function updateQuantity() {
        updateQty({ bookId: bookId, quantity }, {
            onSuccess: () => {
                toast.success("Quantity updated!");
                onUpdated(quantity, remaining);
                onOpenChange(false);
            },
            onError: () => toast.error("Failed to update quantity")
        });
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    Manage Inventory
                </DialogHeader>
                <DialogDescription>
                    Adjust the total number of copies available for this book.
                </DialogDescription>
                <Separator />
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-11 shrink-0 rounded-xl text-xl"
                        onClick={internalDecrease}
                        disabled={isUpdating || quantity <= 0 || remaining <= 0}

                    >
                        −
                    </Button>

                    <div className="flex h-11 flex-1 items-center justify-center rounded-xl border bg-muted/40 text-xl font-semibold">
                        {quantity}
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-11 shrink-0 rounded-xl text-xl"
                        onClick={internalIncrease}
                        disabled={isUpdating}
                    >
                        +
                    </Button>
                </div>

                <DialogFooter>
                    <DialogClose>
                        <Button variant="secondary">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={updateQuantity}
                        disabled={isUpdating || quantity === originalQuantity}
                    >
                        {isUpdating ? "Updating..." : "Update Stock"}
                    </Button>
                </DialogFooter>
            </DialogContent>


        </Dialog>
    );
}