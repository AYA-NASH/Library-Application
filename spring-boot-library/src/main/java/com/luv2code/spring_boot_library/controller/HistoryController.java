package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.dto.LoanDtos;
import com.luv2code.spring_boot_library.entity.UserPrincipal;
import com.luv2code.spring_boot_library.service.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/history/secure")
@RequiredArgsConstructor
@Tag(name = "User Interaction", description = "Endpoints for user borrowing history")
public class HistoryController {

    private final HistoryService historyService;

    @GetMapping("/user")
    public Page<LoanDtos.HistoryResponse> getUserBooksHistory(@AuthenticationPrincipal UserPrincipal user, Pageable pageable) {
        return historyService.getUserBooksHistory(user.getUser().getId(), pageable);
    }
}
