package com.luv2code.spring_boot_library.dto;

import java.time.LocalDate;

public sealed interface DashboardDtos {
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
}
