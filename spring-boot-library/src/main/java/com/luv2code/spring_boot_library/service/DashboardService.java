package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dto.DashboardDtos;
import com.luv2code.spring_boot_library.dto.projection.CategoryCountProjection;
import com.luv2code.spring_boot_library.dto.projection.DateCountProjection;
import com.luv2code.spring_boot_library.repository.BookRepository;
import com.luv2code.spring_boot_library.repository.CheckoutRepository;
import com.luv2code.spring_boot_library.repository.DigitalReadHistoryRepository;
import com.luv2code.spring_boot_library.repository.HistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final BookRepository bookRepository;
    private final CheckoutRepository checkoutRepository;
    private final ActiveUserTracker activeUserTracker;
    private final DigitalReadHistoryRepository digitalReadHistoryRepository;
    private final HistoryRepository historyRepository;

    public DashboardDtos.MainSummaryDTO getMainSummaryMetrics() {
        long totalBooks = bookRepository.count();
        long activeLoans = checkoutRepository.count();
        long activeMembers = activeUserTracker.getActiveUserCount();
        double totalRevenue = 0.0;
        return new DashboardDtos.MainSummaryDTO(
                totalBooks, activeLoans, activeMembers, totalRevenue
        );
    }

    public List<DashboardDtos.PhysicalDigitalReads> getActivityChartData(
            LocalDate startDate, LocalDate endDate
    ) {
        List<DateCountProjection> physicalProjection = historyRepository
                .countPhysicalBorrowsByDateRange(startDate, endDate);

        List<DateCountProjection> DigitalProjection = digitalReadHistoryRepository
                .countDigitalReadsByDateRange(startDate, endDate);

        Map<LocalDate, Long> physicalMap = physicalProjection.stream()
                .collect(Collectors.toMap(DateCountProjection::getDate, DateCountProjection::getCount));

        Map<LocalDate, Long> digitalMap = DigitalProjection.stream()
                .collect(Collectors.toMap(DateCountProjection::getDate, DateCountProjection::getCount));

        return startDate.datesUntil(endDate.plusDays(1))
                .map(date -> new DashboardDtos.PhysicalDigitalReads(
                        date,
                        physicalMap.getOrDefault(date, 0L),
                        digitalMap.getOrDefault(date, 0L)
                ))
                .toList();
    }

    public List<DashboardDtos.TopCategoriesTrends> getTopCategories(
            LocalDate startDate, LocalDate endDate
    ) {
        List<CategoryCountProjection> physicalCount = historyRepository
                .findPhysicalCategoryTrends(startDate, endDate);

        List<CategoryCountProjection> digitalCount = digitalReadHistoryRepository
                .findDigitalCategoryTrends(startDate, endDate);

        Map<String, Long> physicalMap = physicalCount.stream()
                .collect(Collectors.toMap(
                        CategoryCountProjection::getCategory,
                        CategoryCountProjection::getCount,
                        Long::sum
                ));

        Map<String, Long> digitalMap = digitalCount.stream()
                .collect(Collectors.toMap(
                        CategoryCountProjection::getCategory,
                        CategoryCountProjection::getCount,
                        Long::sum
                ));

        Set<String> allCategories = Stream.concat(physicalCount.stream(), digitalCount.stream())
                .map(CategoryCountProjection::getCategory)
                .collect(Collectors.toSet());

        return allCategories.stream()
                .map(category -> new DashboardDtos.TopCategoriesTrends(
                        category,
                        physicalMap.getOrDefault(category, 0L),
                        digitalMap.getOrDefault(category, 0L)
                ))
                .collect(Collectors.toList());
    }
}
