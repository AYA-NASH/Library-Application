package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.dto.BookDtos;
import com.luv2code.spring_boot_library.service.ReadingService;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/reading")
@RequiredArgsConstructor
public class ReadingController {

    private final ReadingService readingService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/secure/{bookId}/full")
    public BookDtos.DigitalAccessResponse getBookUrl(
            @PathVariable("bookId") @Positive Long bookId) {
        return readingService.getBookUrl(bookId);
    }

    @GetMapping("{bookId}/preview")
    public BookDtos.DigitalAccessResponse getBookPreviewUrl(
            @PathVariable("bookId") @Positive Long bookId) {
        return readingService.getBookPreviewUrl(bookId);
    }
}
