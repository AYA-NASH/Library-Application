import { LucideIcon } from "lucide-react";

export type SummaryCardItem = {
    title: string;
    value: number | string;
    icon?: LucideIcon;
    description?: string;
    subDescription?: string;
    trend?: string;
}

export type PhysicalDigitalReads = {
    date: string;
    physicalBorrows: number;
    digitalReads: number;
}

export type TopCategoriesTrends = {
    category: string;
    physicalTrends: number;
    digitalTrends: number;
}

export type InventorySummary = {
    alerts: InventoryAlerts;
    composition: InventoryComposition;
    utilization: InventoryUtilization;
}

type InventoryAlerts = {
    overdueLoans: number;
    outOfStock: number;
    lowStock: number;
}

type InventoryComposition = {
    physicalOnly: number;
    digitalOnly: number;
    hybrid: number;
}

type InventoryUtilization = {
    totalCopies: number;
    availableCopies: number;
}

export type TopBook = {
    title: string;
    author: string;
    physicalReads: number;
    digitalReads: number;
    totalReads: number;
    percentage: number;
}

export type RecentActivityLog = {
    eventCategory: "CIRCULATION" | "TRANSACTIONAL" | "SECURITY" | "INVENTORY" | "SYSTEM";
    actionType: "CHECKOUT_BORROW" | "CHECKOUT_RETURN" | "CHECKOUT_RENEW" | "DIGITAL_READ" | "FEE_LATE" | "FEE_PAID" | "USER_REGISTRATION" | "JOB_FAILED"; 
    actor: string;
    target: string;
    timestamp: string;
}