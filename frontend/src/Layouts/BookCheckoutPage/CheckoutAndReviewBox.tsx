import { BookModel } from "../../models/BookModel";
import { PreviewActionBox } from "./components/PreviewActionBox";
import { PhysicalCheckoutBox } from "./components/PhysicalCheckoutBox";
import { DigitalAccessBox } from "./components/DigitalAccessBox";
import { ReviewActionArea } from "./components/ReviewActionArea";
import { Card, CardContent } from "@/components/ui/card";
import { LogIn, ShoppingCart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useCheckout } from "@/api/hooks/BookHooks/useLoans";
import { parseApiError } from "@/errors/parseApiError";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CheckoutAndReviewBoxProps {
    book: BookModel | undefined;
    isDigitalUnlocked: boolean;
    isReviewLeft: boolean;
}

export function CheckoutAndReviewBox({
    book,
    isDigitalUnlocked,
    isReviewLeft,
}: CheckoutAndReviewBoxProps) {
    const isAuthenticated = useAuthStore((state) => !!state.token);

    if (!book) return null;
    // const [displayError, setDisplayError] = useState(false);

    const { mutate: checkout } = useCheckout();
    const handleCheckout = () => {
        checkout(book.id!, {
            onError: (err) => {
                const apiError = parseApiError(err);
                toast.error(apiError.message);
                // setDisplayError(true);
            },
            // onSuccess: () => setDisplayError(false)
        });
    };
    return (
        <Card className="w-full lg:w-[25%] lg:max-w-sm border-0 shadow-sm rounded-2xl h-fit">
            <CardContent className="p-6 space-y-5">

                <PreviewActionBox
                    bookId={book.id!}
                    bookTitle={book.title}
                />

                <Separator />

                <div>
                    <h5 className="font-bold flex items-center text-lg">
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Borrow or Buy
                    </h5>
                    {!isAuthenticated && (
                        <Button size="lg" className="w-full m-4"
                            nativeButton={false}
                            render={
                                <Link to="/login">
                                    <LogIn />
                                    Sign in to have Access to Actions
                                </Link>
                            }
                        />)}

                    <PhysicalCheckoutBox
                        book={book}
                        checkoutBook={handleCheckout}
                    />
                </div>

                <Separator className="opacity-50" />

                <DigitalAccessBox
                    bookId={book.id!}
                    bookTitle={book.title}
                    isDigitalUnlocked={isDigitalUnlocked}
                />

                <Separator />

                <ReviewActionArea
                    bookId={book.id}
                    isReviewLeft={isReviewLeft}
                />

            </CardContent>
        </Card>
    );
}