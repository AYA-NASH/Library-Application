interface DueDateProps {
    daysLeft: number;
}

export function DueDateMessage({ daysLeft }: DueDateProps) {
    if (daysLeft > 0) {
        return <p className="text-muted-foreground text-sm font-medium">Due in {daysLeft} days.</p>;
    }

    if (daysLeft === 0) {
        return <p className="text-green-600 dark:text-green-500 text-sm font-medium">Due Today.</p>;
    }

    return <p className="text-destructive text-sm font-medium">Past due by {Math.abs(daysLeft)} days.</p>;
}