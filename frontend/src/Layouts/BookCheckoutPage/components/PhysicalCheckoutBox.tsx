import { useCurrentLoansCount, useIsBookCheckedout } from "@/api/hooks/BookHooks/useLoans";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BookModel } from "@/models/BookModel";
import { useAuthStore } from "@/store/useAuthStore";
import { CalendarCheck, CheckCircle, Hourglass, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

interface PhysicalCheckoutProps {
    book: BookModel;
    checkoutBook: () => void;
}

export function PhysicalCheckoutBox({ book, checkoutBook }: PhysicalCheckoutProps) {
    const isAuthenticated = useAuthStore((state) => !!state.token);
    const { data: isCheckedout, isLoading: isLoadingCheckedout } = useIsBookCheckedout(book.id || "");
    const { data: loansCount, isLoading: isLoadingLoansCount } = useCurrentLoansCount();

    const currentLoansCount = loansCount || 0;
    const isAvailable = book.copiesAvailable && book.copiesAvailable > 0;

    const renderCheckoutAction = () => {
        if (isLoadingCheckedout || isLoadingLoansCount) {
            return <Button disabled className="w-full mt-4" size="lg">Loading...</Button>;
        }

        if (isCheckedout) {
            return (
                <Alert className="mt-4 bg-green-50 text-green-900 border">
                    <CheckCircle className="h-4 w-4 stroke-green-600" />
                    <AlertTitle>Borrowed</AlertTitle>
                    <AlertDescription className="mt-2">
                        <Button variant="ghost" size="sm" >
                            <Link to="/loans">Check Status</Link>
                        </Button>
                    </AlertDescription>
                </Alert>
            );
        }

        if (currentLoansCount >= 5) {
            return (
                <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Limit Reached</AlertTitle>
                    <AlertDescription>
                        You have reached the maximum limit of 5 books.
                    </AlertDescription>
                </Alert>
            );
        }

        return (
            <Button
                onClick={checkoutBook}
                disabled={!isAvailable}
                size="lg"
                variant={isAvailable ? "default" : "secondary"}
                className="w-full mt-4"
            >
                {isAvailable ? (
                    <>
                        <CalendarCheck className="mr-2 h-4 w-4" />
                        Borrow Hardcopy
                    </>
                ) : (
                    "Currently Out of Stock"
                )}
            </Button>
        );
    };

    return (
        <div className="space-y-4">
            {/* Header / Stats */}
            <div className="flex justify-between items-center text-sm">
                <span className="font-semibold flex items-center">
                    <CalendarCheck className="mr-2 h-4 w-4 text-muted-foreground" />
                    Physical Copy
                </span>
                <span className="text-muted-foreground">
                    {currentLoansCount} / 5 loans
                </span>
            </div>

            {/* Availability Status */}
            {isAvailable ? (
                <div className="text-success font-semibold flex items-center text-sm">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Available now
                </div>
            ) : (
                <div className="text-destructive font-semibold flex items-center text-sm">
                    <Hourglass className="mr-2 h-4 w-4" />
                    Join wait list
                </div>
            )}

            {/* Copy Count */}
            <p className="text-sm">
                <strong className="font-medium">{book?.copiesAvailable}</strong> available of{" "}
                <strong className="font-medium">{book?.copies}</strong> copies
            </p>

            {isAuthenticated && renderCheckoutAction()}

            <p className="text-xs text-muted-foreground text-center">
                Availability may change until checkout is completed.
            </p>
        </div>
    );
}