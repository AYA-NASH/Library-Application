import { GoogleLogin } from "@react-oauth/google";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const GoogleAuthButton = () => {
    const handleSuccess = async (credentialResponse: any) => {
        const token = credentialResponse.credential;
        console.log("Google Token:", token);

        const response = await fetch(`${baseUrl}/google-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
        });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);
            window.location.href = "/";
        } else {
            throw new Error("Invalid Google's Credentials");
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
