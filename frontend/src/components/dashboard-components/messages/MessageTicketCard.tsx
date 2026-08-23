import { useAdminReply } from "@/api/hooks/LibraryServiceHooks/useMessage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageStatusBadgesConfig } from "@/constants/admin-dashboard/messages/message-configs";
import { parseApiError } from "@/errors/parseApiError";
import { AdminMessageView } from "@/models/MessageModel";
import { ArrowRight, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface MessageTicketCardProps {
    ticket: AdminMessageView;
}

export function MessageTicketCard({ ticket }: MessageTicketCardProps) {
    const [isReplying, setIsReplying] = useState(false);
    const [response, setResponse] = useState("");

    const adminReplyMutation = useAdminReply();

    const isPending = adminReplyMutation.isPending;
    const canSend = response.trim().length > 0;

    function handleCancelReply() {
        if (isPending) return;

        setResponse("");
        setIsReplying(false);
    }


    function handleSendReply() {
        if (!response.trim()) return;

        adminReplyMutation.mutate(
            { messageId: ticket.id, response },
            {
                onSuccess: () => {
                    toast.success(`Reply sent to ${ticket.userEmail}`);
                    setResponse('');
                    setIsReplying(false);
                },
                onError: (err: any) => {
                    const apiError = parseApiError(err);
                    toast.error(apiError.message);
                }
            }
        )
    }

    return (
        <Card className={`rounded-3xl shadow-sm border-l-4 ${MessageStatusBadgesConfig.Open.borderColor}`}>
            <CardHeader className="flex justify-between">
                <div >
                    <div className="flex gap-2">
                        <p className="text-xl text-primary">
                            Case #{ticket.id}
                        </p>

                        <p className="text-lg font-semibold">
                            {ticket.title}
                        </p>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        {new Date(ticket.createdAt).toLocaleDateString(
                            "en-US",
                            {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            }
                        )}
                    </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Badge className={MessageStatusBadgesConfig.Open.variant}>
                        Pending
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
                <div className="rounded-2xl bg-muted p-4 mt-2">
                    <span className="text-sm text-muted-foreground">
                        {ticket.userEmail}
                    </span>

                    <p className="whitespace-pre-wrap text-sm leading-6">
                        {ticket.question}
                    </p>
                </div>

                {isReplying ? (
                    <div className="space-y-4 border-t pt-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Write response
                        </p>

                        <Textarea
                            value={response}
                            onChange={(event) =>
                                setResponse(event.target.value)
                            }
                            placeholder="Write your response to the user..."
                            className="min-h-32 resize-none"
                            disabled={isPending}

                        />

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="ghost"
                                onClick={handleCancelReply}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>

                            <Button
                                onClick={handleSendReply}
                                disabled={!canSend || isPending}
                            >
                                {isPending ? (
                                    <>
                                        Sending
                                        <Loader2 className="size-4 animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        Send Reply
                                        <Send className="size-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-end mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsReplying(true)}
                        >
                            Reply to case
                            <ArrowRight className="size-4" />
                        </Button>
                    </div>
                )}
            </CardContent>

        </Card>
    )
}