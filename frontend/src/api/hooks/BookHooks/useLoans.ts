import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loanService } from "../../services/loanService";
import { useAuthStore } from "../../../store/useAuthStore";

export const useCurrentLoans = (page: number, size: number) => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    return useQuery({
        queryKey: ["user-current-loans"],
        queryFn: () => loanService.getCurrentLoans(page, size),
        enabled: isAuthenticated,
    });
};

export const useIsBookCheckedout = (bookId: string | number) => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    return useQuery({
        queryKey: ["is-checked-out", bookId],
        queryFn: () => loanService.getIsBookCheckedoutByUser(bookId),
        enabled: !!bookId && isAuthenticated,
    })
};

export const useCurrentLoansCount = () => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    return useQuery({
        queryKey: ["user-current-loans-count", isAuthenticated],
        queryFn: () => loanService.getCurrentLoansCount(),
        enabled: !!isAuthenticated,
    })
}

export const useCheckout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (bookId: number | string) => loanService.checkout(bookId),
        onSuccess: (_, bookId) => {
            queryClient.invalidateQueries({ queryKey: ["user-current-loans"] });
            queryClient.invalidateQueries({ queryKey: ["user-current-loans-count"] });
            queryClient.invalidateQueries({ queryKey: ["is-checked-out", bookId] });
            queryClient.invalidateQueries({ queryKey: ["book", bookId] });
        }
    });
};

export const useReturnBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (bookId: number | string) => loanService.returnBook(bookId),
        onSuccess: (_, bookId) => {
            queryClient.invalidateQueries({ queryKey: ["user-current-loans"] });
            queryClient.invalidateQueries({ queryKey: ["user-current-loans-count"] });
            queryClient.invalidateQueries({ queryKey: ["is-checked-out", bookId] });
            queryClient.invalidateQueries({ queryKey: ["book", bookId] });
        }
    });
};

export const useRenewLoan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (bookId: number | string) => loanService.renewLoan(bookId),
        onSuccess: (_, bookId) => {
            queryClient.invalidateQueries({ queryKey: ["user-current-loans"] });
            queryClient.invalidateQueries({ queryKey: ["user-current-loans-count"] });
            queryClient.invalidateQueries({ queryKey: ["is-checked-out", bookId] });
            queryClient.invalidateQueries({ queryKey: ["book", bookId] });
        }
    });
}