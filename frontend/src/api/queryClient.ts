import { parseApiError } from "@/errors/parseApiError";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
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
        }
    }
})