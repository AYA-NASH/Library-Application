import { TableFilterConfig } from "../TableFilterConfig";

export type MessageStatus =
    | "Open"
    | "Resolved";

export const MessageStatusBadgesConfig = {
    Open: {
        label: "Open",
        variant: "bg-primary/10 text-primary",
        borderColor: "border-l-primary",
    },
    Resolved: {
        label: "Resolved",
        variant: "secondary",
        borderColor: "border-l-secondary",
    },
}

export const messagesFilters: TableFilterConfig[] = [
    {
        id: "status",
        title: "Status",
        type: "checkbox",
        options: [
            { value: "Open", label: "Open" },
            { value: "Resolved", label: "Resolved" },
        ],
    },
]

export const messagesSortOptions = [
    {
        value: "status",
        label: "Status",
    },
    {
        value: "user",
        label: "User Name",
    },
]