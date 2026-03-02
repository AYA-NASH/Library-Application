package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.exception.UnauthenticatedException;
import com.luv2code.spring_boot_library.responsemodel.DigitalAccessResponse;
import com.luv2code.spring_boot_library.service.ReadingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reading")
public class ReadingController {
    private ReadingService readingService;

    @Autowired
    public ReadingController(ReadingService readingService){
        this.readingService = readingService;
    }

    @GetMapping("/secure/{bookId}/full")
    public ResponseEntity<DigitalAccessResponse> getBookUrl(@PathVariable("bookId") Long bookId) throws Exception{
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthenticatedException("User is not authenticated");
        }

        DigitalAccessResponse response = readingService.getBookUrl(bookId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/secure/{bookId}/preview")
    public ResponseEntity<DigitalAccessResponse> getBookPreviewUrl(@PathVariable("bookId") Long bookId) throws Exception{
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthenticatedException("User is not authenticated");
        }

        DigitalAccessResponse response = readingService.getBookPreviewUrl(bookId);

        return ResponseEntity.ok(response);
    }
}
