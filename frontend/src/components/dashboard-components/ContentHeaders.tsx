interface ContentHeadersProps {
    header: string;
    subDescription?: string;
    action?: React.ReactNode;
}
export function ContentHeaders({ header, subDescription, action }: ContentHeadersProps) {
    return (
        <div className="flex items-center justify-between border-b border-border pb-5">
            <div>
                <h1 className="text-2xl font-semibold">{header}</h1>
                {subDescription && (
                    <p className="text-muted-foreground">{subDescription}</p>
                )}
            </div>
            {action}
        </div>
    );
}
