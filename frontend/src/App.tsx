import { RouterProvider } from "react-router-dom";

import { router } from "./Routes.tsx";
import { useAuthStore } from "./store/useAuthStore.ts";
import { useEffect } from "react";
import { refreshSession } from "./api/client.ts";

function App() {
    const isCheckingAuth = useAuthStore((s) => s.isCheckingAuth);
    
    useEffect(() => {
        if (isCheckingAuth) {
            void refreshSession();
        }
    }, [isCheckingAuth]);

    return (
        <RouterProvider router={router} />
    );
}


export default App;
