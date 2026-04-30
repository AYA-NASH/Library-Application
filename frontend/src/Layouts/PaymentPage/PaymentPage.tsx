import { useState } from "react";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useCreatePaymentIntent, useFetchFees, useStripePaymentComplete } from "../../api/hooks/PaymentHooks/usePayment";
import { toast } from "sonner";
import { StripeNotConfigured } from "./components/StripeNotConfigured";
import { ApiErrorDisplay } from "../Utils/ApiErrorDisplay";
import { NoFeesEmptyState } from "./components/NoFeesEmptyState";
import { parseApiError } from "../../errors/parseApiError";


const hasStripe = !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export const PaymentPage = () => {
    const stripe = useStripe();
    const elements = useElements();

    const { data: feeData, isLoading: loadingFees, error: feeError, refetch } = useFetchFees();

    const { mutateAsync: createIntent } = useCreatePaymentIntent();
    const { mutateAsync: completePayment } = useStripePaymentComplete();

    const [isProcessing, setIsProcessing] = useState(false);

    const fees = feeData?.lateFeesInDollars ?? 0;

    async function handleCheckout() {
        if (!stripe || !elements || !elements.getElement(CardElement)) return;

        setIsProcessing(true);

        try {
            // get client secret
            const intentData = await createIntent();

            // confirm payment with stripe
            const result = await stripe.confirmCardPayment(intentData.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                }
            });

            if (result.error) {
                toast.error(result.error.message || "Payment Failed");
                setIsProcessing(false);
            } else if (result.paymentIntent?.status === "succeeded") {
                await completePayment();
                toast.success("Payment Completed Successfully, Now you can checkout any books")
                setIsProcessing(false);
            }

        } catch (err: any) {
            const apiError = parseApiError(err);
            toast.error(apiError.message);
            setIsProcessing(false);
        }
    }

    if (!hasStripe) return <StripeNotConfigured />;

    if (loadingFees) return <SpinnerLoading message="Checking for outstanding fees..." />;

    if (feeError) return <ApiErrorDisplay error={feeError} title="Could not retrieve fee information" onRetry={() => refetch()} />;

    return (
        <div className='container py-5'>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    {fees > 0 ? (
                        <div className='card shadow-sm border-0 rounded-4 overflow-hidden'>
                            <div className='card-header bg-danger text-white py-3'>
                                <h5 className='mb-0 fw-bold'>Outstanding Fees: ${fees.toFixed(2)}</h5>
                            </div>
                            <div className='card-body p-4'>
                                <p className="text-muted small mb-4">
                                    Please settle your late return fees to continue borrowing books.
                                </p>

                                <div className="p-3 border rounded-3 mb-4 bg-light">
                                    <label className="form-label fw-bold small text-uppercase">Credit or Debit Card</label>
                                    <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
                                </div>


                                <button
                                    disabled={isProcessing}
                                    className='btn btn-dark w-100 py-3 fw-bold rounded-3'
                                    onClick={handleCheckout}
                                >
                                    {isProcessing ? (
                                        <span className="spinner-border spinner-border-sm me-2" />
                                    ) : `Pay $${fees.toFixed(2)}`}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <NoFeesEmptyState />
                    )}
                </div>
            </div>
        </div>
    );
};
