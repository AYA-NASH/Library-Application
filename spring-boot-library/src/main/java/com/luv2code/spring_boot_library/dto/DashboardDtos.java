package com.luv2code.spring_boot_library.dto;

public sealed interface DashboardDtos {
    record MainSummaryDTO(
            long totalBooks,
            long activeLoans,
            long activeMembers,
            double totalRevenue
    ) implements DashboardDtos {
    }
}
