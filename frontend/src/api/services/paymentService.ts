import { AdminOutstandingResponse, PaymentIntentResponse, PaymentResponse } from "../../models/PaymentInfo";
import apiClient from "../client";
import { PageResponse } from "./bookService";

export const paymentService = {
    fetchFees: async (): Promise<PaymentResponse> => {
        const response = await apiClient.get("/payment/secure/balance");
        return response.data;
    },
    createPaymentIntent: async (): Promise<PaymentIntentResponse> => {
        const response = await apiClient.post("/payment/secure/payment-intent");
        return response.data;
    },
    stripePaymentComplete: async (): Promise<void> => {
        const idempotencyKey = crypto.randomUUID();
        await apiClient.put("/payment/secure/payment-complete", undefined, {
            headers: {
                "Idempotency-Key": idempotencyKey,
            },
        });
    },
    getOutstandingPayments: async (page: number, size: number): Promise<PageResponse<AdminOutstandingResponse>> => {
        const params = { page: page - 1, size: size }
        const response = await apiClient.get("/payment/secure/admin/outstanding", { params });
        return {
            content: response.data.content,
            totalPages: response.data.page.totalPages,
            totalElements: response.data.page.totalElements
        }
    }

}