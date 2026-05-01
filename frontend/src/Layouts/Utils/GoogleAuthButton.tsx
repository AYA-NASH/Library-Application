import { GoogleLogin } from "@react-oauth/google";
import { useAuthActions } from "../../api/hooks/useAuthActions";

import { parseApiError } from "../../errors/parseApiError";
import { toast } from "sonner";


const hasGoogleClient = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GoogleAuthButton = () => {
    if (!hasGoogleClient) {
        return null;
    }

    const { googleLogin } = useAuthActions();

    const handleSuccess = async (credentialResponse: any) => {
        const token = credentialResponse.credential;
        try {
            await googleLogin(token);
        } catch (err) {
            const apiError = parseApiError(err);
            toast.error(apiError.message);
        }
    };

    return (
        <div className="text-center mt-3">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => toast.error("Google login failed")}
            />
        </div>
    );
};

export default GoogleAuthButton;
