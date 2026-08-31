package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.dto.DashboardDtos;
import com.luv2code.spring_boot_library.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/secure/dashboard/main")
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping("/metrics")
    public ResponseEntity<DashboardDtos.MainSummaryDTO> getMainSummaryMetrics(){
        return ResponseEntity.ok(dashboardService.getMainSummaryMetrics());
    }
}
