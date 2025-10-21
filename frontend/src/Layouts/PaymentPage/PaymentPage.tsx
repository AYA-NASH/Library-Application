/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";
import PaymentInfoRequest from "../../models/PaymentInfoRequest";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const PaymentPage = () => {
    const { user, token } = useAuth();

    const [httpError, setHttpError] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [fees, setFees] = useState(0);
    const [loadingFees, setLoadingFees] = useState(true);

    useEffect(() => {
        const fetchFees = async () => {
            if (token) {
                const url = `${baseUrl}/payments/search/findByUserEmail?userEmail=${user.email}`;

                const requestOptions = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                };

                const paymentResponse = await fetch(url, requestOptions);

                if (!paymentResponse.ok) {
                    throw new Error("something went wrong");
                }

                const paymentResponseJson = await paymentResponse.json();
                setFees(paymentResponseJson.amount);
                setLoadingFees(false);
            }
        };

        fetchFees().catch((error: any) => {
            setLoadingFees(false);
            setHttpError(error.message);
        });
    }, [token]);

    const elements = useElements();
    const stripe = useStripe();

    async function checkout() {
        if (!stripe || !elements || !elements.getElement(CardElement)) {
            return;
        }

        setSubmitDisabled(true);

        const paymentInfo = new PaymentInfoRequest(
            Math.round(fees * 100),
            "USD",
            user.email
        );

        const url = `${baseUrl}/payment/secure/payment-intent`;
        const requestOptions = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application.json",
            },
            body: JSON.stringify(paymentInfo),
        };

        const stripeResponse = await fetch(url, requestOptions);

        if (!stripeResponse.ok) {
            setHttpError(true);
            setSubmitDisabled(false);
            throw new Error("Something wrong");
        }

        const stripeResponseJson = await stripeResponse.json();

        stripe
            .confirmCardPayment(
                stripeResponseJson.client_secret,
                {
                    payment_method: {
                        card: elements.getElement(CardElement)!,
                        billing_details: {
                            email: user.email,
                        },
                    },
                },
                { handleActions: false }
            )
            .then(async function (result: any) {
                if (result.error) {
                    setSubmitDisabled(false);
                    alert("There was an error");
                } else {
                    const url = `${baseUrl}/payment/secure/payment-complete`;
                    const requestOptions = {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application.json",
                        },
                    };

                    const stripeResponse = await fetch(url, requestOptions);

                    if (!stripeResponse.ok) {
                        setHttpError(true);
                        setSubmitDisabled(false);
                        throw new Error("Something wrong");
                    }

                    setFees(0);
                    setSubmitDisabled(false);
                }
            });
        setHttpError(false);
    }

    if (loadingFees) {
        return <SpinnerLoading />;
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    return (
        <div className="container">
            {fees > 0 && (
                <div className="card mt-3">
                    <h5 className="card-header">
                        Fees Pending:{" "}
                        <span className="text-danger">${fees}</span>
                    </h5>

                    <div className="card-body">
                        <h5 className="card-title mb-3">Credit Card</h5>
                        <CardElement id="card-element" />
                        <button
                            disabled={submitDisabled}
                            type="button"
                            className="btn btn-md btn-dark text-white mt-3"
                            onClick={checkout}
                        >
                            Pay Fees
                        </button>
                    </div>
                </div>
            )}

            {fees === 0 && (
                <div className="mt-3">
                    <h5>You have no fees!</h5>
                    <Link type="button" className="btn btn-dark" to={"/search"}>
                        Explore top books
                    </Link>
                </div>
            )}

            {submitDisabled && <SpinnerLoading />}
        </div>
    );
};
