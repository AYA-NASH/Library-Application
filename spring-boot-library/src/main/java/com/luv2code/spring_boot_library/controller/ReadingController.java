package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.dto.BookDtos;
import com.luv2code.spring_boot_library.service.ReadingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reading")
public class ReadingController {
    private ReadingService readingService;

    @Autowired
    public ReadingController(ReadingService readingService) {
        this.readingService = readingService;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/secure/{bookId}/full")
    public ResponseEntity<BookDtos.DigitalAccessResponse> getBookUrl(@PathVariable("bookId") Long bookId) throws Exception {
        BookDtos.DigitalAccessResponse response = readingService.getBookUrl(bookId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/secure/{bookId}/preview")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookDtos.DigitalAccessResponse> getBookPreviewUrl(@PathVariable("bookId") Long bookId) throws Exception {
        BookDtos.DigitalAccessResponse response = readingService.getBookPreviewUrl(bookId);

        return ResponseEntity.ok(response);
    }
}
