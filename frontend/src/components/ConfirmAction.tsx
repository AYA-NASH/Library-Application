import React, { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2Icon } from "lucide-react";

interface ConfirmActionProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    title?: string;
    confirmText?: string;
    description: React.ReactNode;
    trigger: React.ReactElement;
    isProcessing?: boolean;
    disabled?: boolean;
    onConfirm: () => void;
}

export function ConfirmAction({
    open: externalOpen,
    onOpenChange: externalOnOpenChange,
    title = "Are you sure?",
    confirmText = "Delete",
    description,
    trigger,
    isProcessing = false,
    disabled = false,
    onConfirm
}: ConfirmActionProps) {
    const [internalOpen, setInternalOpen] = useState(false);

    const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
    const setIsOpen = externalOnOpenChange ?? setInternalOpen;

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger
                render={trigger}
            />

            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20">
                        <Trash2Icon />
                    </AlertDialogMedia>

                    <AlertDialogTitle>{title}</AlertDialogTitle>

                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive"
                        onClick={() => onConfirm()}
                        disabled={isProcessing || disabled}
                    >
                        {isProcessing && <Loader2 className="mr-2 size-4 animate-spin" />}
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>

        </AlertDialog>)
}
