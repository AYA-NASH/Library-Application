import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { messageService } from "../../services/messageService";
import { AdminReplyRequest, userCreateMessageRequest } from "../../../models/MessageModel";

// -------- USER --------------
export const useUserMessages = (page: number, size: number) => {
    return useQuery({
        queryKey: ["messages", "user", page, size],
        queryFn: () => messageService.getUserMessges(page, size),
    });
};

export const useAddUserMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: userCreateMessageRequest) => messageService.userAddMessage(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["messages", "user"] });
            toast.success("Question submitted successfully!");
        },
        onError: () => toast.error("Failed to send message."),
    });
};



// ------- ADMIN --------------
export const useAdminOpenMessages = (page: number, size: number) => {
    return useQuery({
        queryKey: ["messages", "admin", "open", page, size],
        queryFn: () => messageService.getAdminOpenedMessages(page, size),
    });
};

export const useAdminReply = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: AdminReplyRequest) => messageService.adminReply(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["messages", "admin", "open"] });
            queryClient.invalidateQueries({ queryKey: ["messages", "user"] });
            toast.success("Reply sent successfully!");
        },
        onError: () => toast.error("Failed to send reply."),
    });
};