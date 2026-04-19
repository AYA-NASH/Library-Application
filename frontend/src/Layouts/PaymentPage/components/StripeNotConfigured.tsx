export const StripeNotConfigured = () => (
    <div className="alert alert-warning m-5 shadow-sm">
        <h4 className="alert-heading fw-bold">Payments are not configured</h4>
        <p className="mb-0 text-dark">Missing keys in environment variables. Check VITE_STRIPE_PUBLISHABLE_KEY.</p>
    </div>
);