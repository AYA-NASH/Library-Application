import { HistoryModel } from "../../../models/HistoryModel";
import placeholder from '../../../Images/BooksImages/book-luv2code-1000.png';
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, CheckCircle2 } from "lucide-react";


interface HistoryItemProps {
    history: HistoryModel;
}

export function HistoryItem({ history }: HistoryItemProps) {
    return (
        <Card className="w-full overflow-hidden transition-shadow hover:shadow-md border-border/50">
            <CardContent className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6">

                <div className="flex w-full sm:w-32 shrink-0 items-center justify-center bg-muted/20 rounded-md p-2">
                    <img
                        src={history.img || placeholder}
                        alt={history.title}
                        className="h-auto w-24 sm:w-full rounded object-cover shadow-sm"
                    />
                </div>

                <div className="flex flex-1 min-w-0 flex-col justify-between">
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold tracking-tight break-words">{history.title}</h3>
                        <p className="mt-1 text-sm font-medium text-muted-foreground break-words">{history.author}</p>

                        <p className="mt-3 sm:mt-4 text-sm text-foreground/90 line-clamp-3 leading-relaxed break-words [overflow-wrap:anywhere]">
                            {history.description}
                        </p>
                    </div>

                    <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3">
                        <div className="flex items-center gap-2 rounded-md border border-border/50 bg-muted/10 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs text-muted-foreground shadow-sm">
                            <CalendarDays className="h-4 w-4 shrink-0 opacity-70" />
                            <span className="break-all sm:break-normal">Checked out: {history.checkoutDate}</span>
                        </div>

                        <div className="flex items-center gap-2 rounded-md border border-green-500/20 bg-green-500/10 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs text-green-700 dark:text-green-400 shadow-sm">
                            <CheckCircle2 className="h-4 w-4 shrink-0 opacity-70" />
                            <span className="break-all sm:break-normal">Returned: {history.returnedDate}</span>
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}