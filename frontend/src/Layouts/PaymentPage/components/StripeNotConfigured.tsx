import { CreditCard, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface StripeNotConfiguredProps {
    onRetry?: () => void;
}

export const StripeNotConfigured = ({
    onRetry,
}: StripeNotConfiguredProps) => {
    return (
        <div className="flex min-h-[60vh] items-center justify-center px-4 py-10">
            <Card className="w-full max-w-2xl shadow-sm">
                <CardContent className="flex flex-col items-center px-6 py-12 text-center sm:px-10 sm:py-16">
                    {/* Payment Error Icon */}
                    <div className="relative mb-7">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                            <CreditCard className="h-10 w-10 text-muted-foreground" />
                        </div>

                        <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm">
                            <X className="h-4 w-4" strokeWidth={3} />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        We’re unable to process your payment
                    </h2>

                    <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
                        There seems to be an issue connecting to our payment
                        service. Please try again later.
                    </p>

                    {onRetry && (
                        <Button
                            type="button"
                            onClick={onRetry}
                            className="mt-8 h-11 min-w-36"
                        >
                            Try Again
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};