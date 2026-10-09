import { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import {
    AlertCircle,
    CreditCard,
    Loader2,
    Lock,
    ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import {
    useCreatePaymentIntent,
    useFetchFees,
    useStripePaymentComplete,
} from "../../api/hooks/PaymentHooks/usePayment";
import { parseApiError } from "../../errors/parseApiError";

import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { ApiErrorDisplay } from "../Utils/ApiErrorDisplay";
import { StripeNotConfigured } from "./components/StripeNotConfigured";
import { NoFeesEmptyState } from "./components/NoFeesEmptyState";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const hasStripe = !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export const PaymentPage = () => {
    const stripe = useStripe();
    const elements = useElements();

    const {
        data: feeData,
        isLoading: loadingFees,
        error: feeError,
        refetch,
    } = useFetchFees();

    const { mutateAsync: createIntent } = useCreatePaymentIntent();
    const { mutateAsync: completePayment } = useStripePaymentComplete();

    const [isProcessing, setIsProcessing] = useState(false);

    const fees = feeData?.lateFeesInDollars ?? 0;

    async function handleCheckout() {
        const cardElement = elements?.getElement(CardElement);

        if (!stripe || !cardElement) return;

        setIsProcessing(true);

        try {
            const intentData = await createIntent();

            const result = await stripe.confirmCardPayment(
                intentData.clientSecret,
                {
                    payment_method: {
                        card: cardElement,
                    },
                }
            );

            if (result.error) {
                toast.error(result.error.message || "Payment failed.");
                return;
            }

            if (result.paymentIntent?.status === "succeeded") {
                await completePayment();

                toast.success(
                    "Payment completed successfully. You can now borrow books."
                );

                await refetch();
            }
        } catch (err: any) {
            const apiError = parseApiError(err);
            toast.error(apiError.message);
        } finally {
            setIsProcessing(false);
        }
    }

    if (!hasStripe) return <StripeNotConfigured />;

    if (loadingFees) {
        return (
            <SpinnerLoading message="Checking for outstanding fees..." />
        );
    }

    if (feeError) {
        return (
            <ApiErrorDisplay
                error={feeError}
                title="Could not retrieve fee information"
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 lg:py-16">
            {fees > 0 ? (
                <Card className="overflow-hidden shadow-sm">
                    <CardHeader className="border-b bg-muted/30 px-6 py-6 sm:px-8">
                        <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                                <AlertCircle className="h-5 w-5 text-destructive" />
                            </div>

                            <div className="min-w-0">
                                <CardTitle className="text-xl sm:text-2xl">
                                    Outstanding balance
                                </CardTitle>

                                <CardDescription className="mt-1">
                                    Please settle your late return fees before
                                    borrowing another book.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-7 px-6 py-7 sm:px-8">
                        <div className="rounded-lg border bg-muted/20 px-5 py-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Amount due
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Late return fees
                                    </p>
                                </div>

                                <p className="text-3xl font-bold tracking-tight">
                                    ${fees.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="flex items-center gap-2 text-sm font-semibold">
                                    <CreditCard className="h-4 w-4" />
                                    Payment method
                                </Label>

                                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Lock className="h-3.5 w-3.5" />
                                    Secure payment
                                </span>
                            </div>

                            <div className="rounded-lg border bg-background px-4 py-3.5 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                                <CardElement
                                    options={{
                                        style: {
                                            base: {
                                                fontSize: "16px",
                                                color: "#18181b",
                                                fontFamily:
                                                    "Inter, system-ui, sans-serif",
                                                "::placeholder": {
                                                    color: "#a1a1aa",
                                                },
                                            },
                                            invalid: {
                                                color: "#dc2626",
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <Button
                                type="button"
                                disabled={isProcessing || !stripe}
                                onClick={handleCheckout}
                                className="h-12 w-full text-base font-semibold"
                                size="lg"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Processing payment...
                                    </>
                                ) : (
                                    `Pay $${fees.toFixed(2)}`
                                )}
                            </Button>

                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                <ShieldCheck className="h-4 w-4" />
                                Your payment information is securely processed
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <NoFeesEmptyState />
            )}
        </div>
    );
};