package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.dto.DashboardDtos;
import com.luv2code.spring_boot_library.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/secure/dashboard/main")
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping("/metrics")
    public ResponseEntity<DashboardDtos.MainSummaryDTO> getMainSummaryMetrics() {
        return ResponseEntity.ok(dashboardService.getMainSummaryMetrics());
    }

    @GetMapping("/physical-digital-activity")
    public List<DashboardDtos.PhysicalDigitalReads> getActivities(
            @RequestParam(defaultValue = "90") int days
    ) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days);

        return dashboardService.getActivityChartData(startDate, endDate);
    }

    @GetMapping("/category-trends")
    public List<DashboardDtos.TopCategoriesTrends> getTrends(
            @RequestParam(defaultValue = "30") int days
    ) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days);

        return dashboardService.getTopCategories(startDate, endDate);
    }

    @GetMapping("/inventory-summary")
    public DashboardDtos.InventorySummary getInventorySummary(
            @RequestParam(defaultValue = "2") int lowStockThreshold
    ) {
        return dashboardService.getInventorySummary(lowStockThreshold);
    }
}
