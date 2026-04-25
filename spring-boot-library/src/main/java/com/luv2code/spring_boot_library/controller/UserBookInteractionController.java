package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.dto.InteractionDtos;
import com.luv2code.spring_boot_library.entity.UserPrincipal;
import com.luv2code.spring_boot_library.service.UserBookInteractionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interactions/secure/book/")
@RequiredArgsConstructor
@Tag(name = "User Interaction", description = "Endpoints for user-book interactions like reading progress")
public class UserBookInteractionController {
    private final UserBookInteractionService service;

    @GetMapping("/{bookId}/last-page")
    public ResponseEntity<Integer> getLastReadPage(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable("bookId") Long bookId) {

        Integer page = service.getLastReadPage(user.getUser().getId(), bookId);

        return ResponseEntity.ok(page);
    }

    @PutMapping("/{bookId}/interact")
    public ResponseEntity<Void> updateLastReadPage(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable("bookId") Long bookId,
            @Valid @RequestBody InteractionDtos.ProgressRequest request) {

        service.updateLastReadPage(user.getUser().getId(), bookId, request);
        return ResponseEntity.ok().build();
    }

}
