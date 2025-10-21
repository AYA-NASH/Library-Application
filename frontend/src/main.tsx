import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const stripePromise = loadStripe(
    "pk_test_51PIRrMRv0GnFPe3t15P9YWgSoytSvVnElQtb84cDQkzx6RdprmbCPtAU66RcRwgZZI25JlDUG7nPVLbxGKBeNSGZ00atMt0rTg"
);

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <Elements stripe={stripePromise}>
                <App />
            </Elements>
        </GoogleOAuthProvider>
    </BrowserRouter>
);
