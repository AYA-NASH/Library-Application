import { useActivityFeed } from "@/api/hooks/LibraryServiceHooks/useDashboard";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { RecentActivityLog } from "@/models/MainDashboard";
import {
    Loader2,
    ArrowRightLeft,
    CreditCard,
    UserPlus,
    MessageSquare,
    ShieldAlert,
    Activity
} from "lucide-react";

export function RecentActivity() {
    const token = useAuthStore((state) => state.token);
    const { activities, isLoading, isError } = useActivityFeed(token ?? "");

    const formatTime = (isoString: string) => {
        try {
            return new Date(isoString).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return isoString;
        }
    };

    // 1. Map categories to specific styling and icons
    const getCategoryConfig = (category: string) => {
        switch (category) {
            case "CIRCULATION":
                return { icon: ArrowRightLeft, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" };
            case "TRANSACTIONAL":
                return { icon: CreditCard, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30" };
            case "USER_MANAGEMENT":
                return { icon: UserPlus, color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30" };
            case "COMMUNITY":
                return { icon: MessageSquare, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30" };
            case "SECURITY":
            case "SYSTEM":
                return { icon: ShieldAlert, color: "text-rose-600 bg-rose-100 dark:bg-rose-900/30" };
            default:
                return { icon: Activity, color: "text-slate-600 bg-slate-100 dark:bg-slate-900/30" };
        }
    };

    // 2. Generate natural language sentences based on the action type
    const renderActivityMessage = (activity: RecentActivityLog) => {
        const { actionType, actor, target } = activity;

        // Reusable styled snippets for the sentence
        const Actor = () => <span className="font-semibold text-foreground">{actor}</span>;
        const Target = () => target ? <span className="font-medium text-foreground italic">{target}</span> : null;

        switch (actionType) {
            // Circulation
            case "CHECKOUT_BORROW":
                return <><Actor /> checked out <Target /></>;
            case "CHECKOUT_RETURN":
                return <><Actor /> returned <Target /></>;
            case "CHECKOUT_RENEW":
                return <><Actor /> renewed <Target /></>;
            case "DIGITAL_READ":
                return <><Actor /> is reading <Target /> digitally</>;

            // Community
            // case "REVIEW_POSTED":
            //     return <><Actor /> posted a new review for <Target /></>;

            // Users
            case "USER_REGISTRATION":
                return <>New account created by <Actor /></>;

            // Transactions
            case "FEE_PAID":
                return <><Actor /> paid a fee for <Target /></>;
            case "FEE_LATE":
                return <><Actor /> was charged a late fee for <Target /></>;

            // Fallback for unknown actions
            default:
                const formattedAction = actionType.replace(/_/g, " ").toLowerCase();
                return <><Actor /> {formattedAction} {target && <Target />}</>;
        }
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-border/50 mb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold text-foreground">
                        Recent Activity
                    </CardTitle>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Live
                    </span>
                </div>
                <CardDescription className="text-muted-foreground text-sm">
                    Real-time system event feed
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden px-2 pb-2">
                {isLoading && (
                    <div className="flex h-40 items-center justify-center text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        <span className="text-sm">Loading activity stream...</span>
                    </div>
                )}

                {isError && (
                    <div className="flex h-40 items-center justify-center text-sm text-destructive">
                        Failed to connect to activity stream.
                    </div>
                )}

                {!isLoading && !isError && activities.length === 0 && (
                    <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                        No activity recorded yet.
                    </div>
                )}

                {!isLoading && !isError && activities.length > 0 && (
                    <div className="max-h-95 overflow-y-auto px-4 space-y-4">
                        {activities.map((activity, index) => {
                            const config = getCategoryConfig(activity.eventCategory);
                            const Icon = config.icon;

                            return (
                                <div
                                    key={`${activity.timestamp}-${activity.actor}-${index}`}
                                    className="flex items-start gap-3 text-sm"
                                >
                                    {/* Category Icon Badge */}
                                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${config.color}`}>
                                        <Icon className="h-4 w-4" />
                                    </div>

                                    {/* Action Text & Timestamp */}
                                    <div className="flex flex-col gap-0.5">
                                        <div className="leading-snug text-muted-foreground">
                                            {renderActivityMessage(activity)}
                                        </div>
                                        <span className="text-xs text-muted-foreground/60 tabular-nums">
                                            {formatTime(activity.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}