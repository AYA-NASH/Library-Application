import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    action?: ReactNode;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action
}: EmptyStateProps) {
    return (
        <Card className="mx-auto w-full max-w-3xl py-12">
            <CardHeader className="flex flex-col items-center gap-2">
                <CardTitle className="text-xl">
                    {Icon && (
                        <Icon className="h-12 w-12 text-muted-foreground/50" />
                    )}
                    {title}
                </CardTitle>
                <CardDescription className="text-lg">
                    {description}
                </CardDescription>

            </CardHeader>

            {action && (
                <Button variant="link" className="text-lg">
                    {action}
                </Button>
            )}
        </Card>
    );
}