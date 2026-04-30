import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Toaster } from 'sonner';

import "./types/pdfjs-worker";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : undefined;

import { parseApiError } from "./errors/parseApiError";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error) => {
                const apiError = parseApiError(error);

                if (failureCount >= 2) return false;

                if (!apiError.status || apiError.status >= 500) {
                    return true;
                }

                return false;
            },
            refetchOnWindowFocus: false,
        },
    },
});

createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <Toaster position="top-center" richColors closeButton />
            {GOOGLE_CLIENT_ID ? (
                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                    {stripePromise ? (
                        <Elements stripe={stripePromise}>
                            <App />
                        </Elements>
                    ) : (
                        <App />
                    )}
                </GoogleOAuthProvider>
            ) : (
                <App />
            )}
        </BrowserRouter>
    </QueryClientProvider>
);
