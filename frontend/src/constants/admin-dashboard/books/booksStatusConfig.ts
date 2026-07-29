export const bookStatusConfig = {
    available: {
        label: "Available",
        variant: "default",
    },
    low_stock: {
        label: "Low Stock",
        variant: "secondary",
    },
    out_of_stock: {
        label: "Out of Stock",
        variant: "destructive",
    },
    archived: {
        label: "Archived",
        variant: "outline",
    },
} as const;