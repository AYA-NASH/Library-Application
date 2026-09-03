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
            long DigitalReads
    ) implements DashboardDtos {
    }
}
