import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { paymentService } from "../../services/paymentService"

export const useFetchFees = () => {
    return useQuery({
        queryFn: () => paymentService.fetchFees(),
        queryKey: ["user-late-fees"]
    });
};

export const useCreatePaymentIntent = () => {
    return useMutation({
        mutationFn: () => paymentService.createPaymentIntent()
    });
};

export const useStripePaymentComplete = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => paymentService.stripePaymentComplete(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-late-fees"] });
        }
    });
};

export const useGetOutstandingPayments = (page: number, size: number) => {
    return useQuery({
        queryFn: () => paymentService.getOutstandingPayments(page, size),
        queryKey: ["outstanding-payments"]
    });
}

