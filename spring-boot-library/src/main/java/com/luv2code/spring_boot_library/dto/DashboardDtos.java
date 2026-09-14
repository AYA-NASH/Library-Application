package com.luv2code.spring_boot_library.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public sealed interface DashboardDtos {
    enum ActionType {
        CHECKOUT_BORROW,
        CHECKOUT_RETURN,
        CHECKOUT_RENEW,
        BOOK_ADDED,
        BOOK_DELETED,
        USER_REGISTRATION,
        FEE_PAID,
        FEE_LATE,
        REVIEW_POSTED,
        JOB_FAILED
    }

    enum EventCategory {
        TRANSACTIONAL,
        SYSTEM,
        CIRCULATION,   // Book checkouts, returns, renewals
        INVENTORY,
        USER_MANAGEMENT,
        COMMUNITY
    }

    record MainSummaryDTO(
            long totalBooks,
            long activeLoans,
            long activeMembers,
            double totalRevenue
    ) implements DashboardDtos {
    }

    record PhysicalDigitalReads(
            LocalDate date,
            long physicalBorrows,
            long digitalReads
    ) implements DashboardDtos {
    }

    record TopCategoriesTrends(
            String category,
            Long physicalTrends,
            Long digitalTrends
    ) implements DashboardDtos {
    }

    record InventorySummary(
            Alerts alerts,
            Composition catalogComposition,
            Utilization shelfUtilization
    ) implements DashboardDtos {
    }

    record Alerts(
            long overdueLoans,
            long outOfStock,
            long lowStock
    ) {
    }

    record Composition(
            long physicalOnly,
            long digitalOnly,
            long hybrid
    ) {
    }

    record Utilization(
            long totalCopies,
            long availableCopies
    ) {
    }

    record TopBook(
            String title,
            String author,
            long physicalReads,
            long digitalReads,
            long totalReads,
            double percentage
    ) implements DashboardDtos {
    }

    record RecentActivity(
            EventCategory category,
            ActionType actionType,
            String actor,
            String target,
            LocalDateTime timestamp
    ) implements DashboardDtos {
    }
}
