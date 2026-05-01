export interface PaymentResponse {
    userId: number;
    lateFeesInDollars: number;
}

export interface PaymentIntentResponse {
    clientSecret: string;
    amount: number;
    currency: string;
}

export interface AdminOutstandingResponse {
    userId: number;
    userEmail: string;
    lateFees: number;
}