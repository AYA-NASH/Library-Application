import { Card, CardContent } from "@/components/ui/card";
import { ShelfCurrentLoans } from "@/models/ShelfCurrentLoans";
import { DueDateMessage } from "./DueDateMessage";
import { CalendarClock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRenewLoan, useReturnBook } from "@/api/hooks/BookHooks/useLoans";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface LoanCardProps {
    loan: ShelfCurrentLoans
}

export function LoanCard({ loan }: LoanCardProps) {
    const { book, daysLeft } = loan;

    const { mutate: returnBook, isPending: isReturning } = useReturnBook();
    const { mutate: renewLoan, isPending: isRenewing } = useRenewLoan();

    const [isOpen, setIsOpen] = useState(false)

    const handleReturn = () => {
        returnBook(book.id, {
            onSuccess: () => {
                toast.success(`${book.title} has been returned.`);
                if (daysLeft < 0) {
                    toast.error("Late return. Please pay any accumulated fees.");
                }
                setIsOpen(false);
            },
            onError: () => {
                toast.error("Failed to return the book.");
            }

        });
    }

    const handleRenew = () => {
        renewLoan(book.id, {
            onSuccess: () => {
                toast.success("Due date extended by 7 days.");
                setIsOpen(false);
            },
            onError: () => {
                toast.error("Failed to renew the loan.");
            }
        });
    };

    return (
        <Card className="w-full overflow-hidden">
            <CardContent className="flex flex-col lg:flex-row justify-between gap-6 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 min-w-0 flex-1">
                    <img
                        src={book.img}
                        alt={book.title}
                        className="h-auto w-24 sm:w-32 shrink-0 rounded object-cover shadow-sm self-center sm:self-start"
                    />
                    <div className="text-center sm:text-left min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl font-bold tracking-tight break-words">{book.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground break-words">{book.author}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-3 w-full lg:w-72 xl:w-80 shrink-0">
                    <div className="flex items-center justify-center rounded-md border p-2 text-center">
                        <CalendarClock className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                        <DueDateMessage daysLeft={daysLeft} />
                    </div>
                    <Separator className="my-2 sm:my-3" />
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger render={
                            <Button variant="default" className="w-full hover:cursor-pointer">
                                Manage Loan
                            </Button>
                        }
                        />

                        <DialogContent className="max-w-[90vw] sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Loan Options</DialogTitle>
                                <DialogDescription>
                                    Choose to return this book or extend your loan period by an additional 7 days.
                                </DialogDescription>
                            </DialogHeader>

                            <Separator />

                            <Button onClick={handleReturn} disabled={isReturning || isRenewing} className="w-full hover:cursor-pointer">
                                {isReturning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Return Book
                            </Button>

                            <Button
                                variant={(daysLeft < 0) ? "destructive" : "outline"}
                                onClick={handleRenew}
                                // Disable if the book is late, or if any mutation is currently running
                                disabled={daysLeft < 0 || isRenewing || isReturning}
                                className="w-full"
                            >
                                {isRenewing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {daysLeft < 0 ? "Late dues cannot be renewed" : "Renew for 7 days"}
                            </Button>
                        </DialogContent>

                    </Dialog>

                    <Button variant="secondary" className="w-full" nativeButton={false} render={<Link to={`/checkout/${book.id}`}> Leave a Review </Link>} />
                </div>
            </CardContent>
        </Card>
    );
}