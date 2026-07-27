import {
    Alert,
    AlertAction,
    AlertDescription,
    AlertTitle
} from "@/components/ui/alert";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QueryErrorAlertProps {
    title?: string;
    description?: string;
    onRetry?: () => void;
    className?: string;
}

export function QueryErrorAlert({
    title = "Failed to Load data",
    description = "Something went wrong while fetching the latest information.",
    onRetry,
    className = "max-w-md",
}: QueryErrorAlertProps) {
    return (
        <Alert variant="destructive" className={className}>
            <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <div>
                    <AlertTitle>{title}</AlertTitle>
                    <AlertDescription >{description}</AlertDescription>
                </div>
            </div>

            {onRetry && (
                <AlertAction>
                    <Button
                        variant="outline"
                        onClick={onRetry}
                        className="text-destructive hover:text-destructive"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Retry
                    </Button>
                </AlertAction>
            )}
        </Alert>
    )
}