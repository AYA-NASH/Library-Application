package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dto.DashboardDtos;
import com.luv2code.spring_boot_library.repository.BookRepository;
import com.luv2code.spring_boot_library.repository.CheckoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final BookRepository bookRepository;
    private final CheckoutRepository checkoutRepository;
    private final ActiveUserTracker activeUserTracker;

    public DashboardDtos.MainSummaryDTO getMainSummaryMetrics() {
        long totalBooks = bookRepository.count();
        long activeLoans = checkoutRepository.count();
        long activeMembers = activeUserTracker.getActiveUserCount();
        double totalRevenue = 0.0;
        return new DashboardDtos.MainSummaryDTO(
                totalBooks, activeLoans, activeMembers, totalRevenue
        );
    }
}
