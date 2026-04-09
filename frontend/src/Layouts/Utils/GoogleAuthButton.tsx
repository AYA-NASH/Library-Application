import { GoogleLogin } from "@react-oauth/google";
import { useAuthActions } from "../../api/hooks/useAuthActions";

const hasGoogleClient = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GoogleAuthButton = () => {
    if (!hasGoogleClient) {
        return null; // Google is not configured; hide button gracefully
    }

    const { googleLogin } = useAuthActions();

    const handleSuccess = async (credentialResponse: any) => {
        const token = credentialResponse.credential;
        try {
            await googleLogin(token);
        } catch (error) {
            console.error("Google Login Error:", error);
            alert("Failed to sign in with Google.");
        }
    };

    return (
        <div className="text-center mt-3">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => console.log("Google Login Failed")}
            />
        </div>
    );
};

export default GoogleAuthButton;
