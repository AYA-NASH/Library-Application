import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { MessageSquareText, Send } from "lucide-react";

import { useAddUserMessage } from "../../../api/hooks/LibraryServiceHooks/useMessage";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const messageSchema = z.object({
    title: z.string().trim().min(1, "Subject is required."),
    question: z.string().trim().min(1, "Description is required."),
});

type MessageFormValues = z.infer<typeof messageSchema>;

export const PostNewMessage = () => {
    const { mutate: addMessage, isPending } = useAddUserMessage();

    const form = useForm<MessageFormValues>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            title: "",
            question: "",
        },
    });

    function submitNewQuestion(values: MessageFormValues) {
        addMessage(
            {
                title: values.title,
                question: values.question,
            },
            {
                onSuccess: () => form.reset(),
            }
        );
    }

    return (
        <Card className="overflow-hidden border-border/60 shadow-sm">
            <CardHeader className="gap-3 border-b border-border/60 bg-muted/30 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <MessageSquareText className="size-5" />
                    </div>

                    <div className="space-y-1">
                        <CardTitle className="text-lg">
                            Submit a New Inquiry
                        </CardTitle>
                        <CardDescription>
                            Have a question or need assistance? Send our team a message.
                        </CardDescription>
                    </div>
                </div>

                <p className="text-xs text-muted-foreground sm:pl-13">
                    Our administration team typically responds within 24 hours.
                </p>
            </CardHeader>

            <CardContent className="p-5 sm:p-6">
                <form
                    onSubmit={form.handleSubmit(submitNewQuestion)}
                    className="space-y-5"
                >
                    <FieldGroup className="gap-5">
                        <Controller
                            name="title"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Subject
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="What can we help you with?"
                                        aria-invalid={fieldState.invalid}
                                        disabled={isPending}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="question"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Detailed description
                                    </FieldLabel>

                                    <Textarea
                                        {...field}
                                        id={field.name}
                                        placeholder="Please provide details to help us understand your inquiry..."
                                        rows={5}
                                        className="resize-y"
                                        aria-invalid={fieldState.invalid}
                                        disabled={isPending}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <div className="flex justify-end border-t border-border/60 pt-4">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="size-4" />
                                    Post Message
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};