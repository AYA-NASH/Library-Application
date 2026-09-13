package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dto.DashboardDtos;
import com.luv2code.spring_boot_library.dto.projection.BookReadCountProjection;
import com.luv2code.spring_boot_library.dto.projection.CategoryCountProjection;
import com.luv2code.spring_boot_library.dto.projection.DateCountProjection;
import com.luv2code.spring_boot_library.repository.BookRepository;
import com.luv2code.spring_boot_library.repository.CheckoutRepository;
import com.luv2code.spring_boot_library.repository.DigitalReadHistoryRepository;
import com.luv2code.spring_boot_library.repository.HistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
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

    public DashboardDtos.InventorySummary getInventorySummary(int minThreshold) {
        long overdueLoans = checkoutRepository.countOverdueLoans();
        long outOfStockBooks = bookRepository.countOutOfStockBooks();
        long lowStockBooks = bookRepository.countLowStockBooks(minThreshold);

        DashboardDtos.Alerts alerts = new DashboardDtos.Alerts(
                overdueLoans, outOfStockBooks, lowStockBooks
        );

        long physicalOnly = bookRepository.countPhysical();
        long digitalOnly = bookRepository.countDigital();
        long hybrid = bookRepository.countHybrid();

        DashboardDtos.Composition composition = new DashboardDtos.Composition(
                physicalOnly, digitalOnly, hybrid
        );

        long totalCopies = bookRepository.sumTotalCopies();
        long availableCopies = bookRepository.sumAvailableCopies();

        DashboardDtos.Utilization utilization = new DashboardDtos.Utilization(
                totalCopies, availableCopies
        );

        return new DashboardDtos.InventorySummary(alerts, composition, utilization);
    }

    public List<DashboardDtos.TopBook> getTopBooks(LocalDate startDate, LocalDate endDate) {
        List<BookReadCountProjection> digitalReads = digitalReadHistoryRepository
                .countDigitalBookReadsByDate(startDate, endDate);

        List<BookReadCountProjection> physicalReads = historyRepository
                .countPhysicalBookReadsByDate(startDate, endDate);

        class BookAggregator {
            String title;
            String author;
            long physical = 0;
            long digital = 0;

            BookAggregator(String title, String author) {
                this.title = title;
                this.author = author;
            }

            long getTotal() {
                return physical + digital;
            }
        }

        Map<Long, BookAggregator> mergedBooks = new HashMap<>();

        physicalReads.forEach(p -> {
            BookAggregator agg = mergedBooks.computeIfAbsent(
                    p.getBookId(), k -> new BookAggregator(p.getTitle(), p.getAuthor())
            );
            agg.physical += p.getCount();
        });

        digitalReads.forEach(d -> {
            BookAggregator agg = mergedBooks.computeIfAbsent(
                    d.getBookId(), k -> new BookAggregator(d.getTitle(), d.getAuthor())
            );
            agg.digital += d.getCount();
        });

        long grandTotalReads = mergedBooks.values().stream()
                .mapToLong(BookAggregator::getTotal)
                .sum();
        return mergedBooks.values().stream()
                .sorted(Comparator.comparingLong(BookAggregator::getTotal).reversed())
                .limit(10)
                .map(agg -> {
                    double rawPercentage = grandTotalReads == 0 ? 0.0 : (agg.getTotal() * 100.0) / grandTotalReads;
                    double roundedPercentage = Math.round(rawPercentage * 100.0) / 100.0;

                    return new DashboardDtos.TopBook(
                            agg.title,
                            agg.author,
                            agg.physical,
                            agg.digital,
                            agg.getTotal(),
                            roundedPercentage
                    );
                })
                .collect(Collectors.toList());
    }
}
