package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.dto.MessageDtos;
import com.luv2code.spring_boot_library.entity.UserPrincipal;
import com.luv2code.spring_boot_library.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@Tag(name = "User Interaction", description = "Endpoints for user support messages and admin replies")
public class MessagesController {

    private final MessageService messageService;

    @GetMapping("/mine")
    public Page<MessageDtos.MessageResponse> getUserMessages(
            @AuthenticationPrincipal UserPrincipal currentUser,
            Pageable pageable
    ) {
        return messageService.getUserMessages(currentUser.getUser().getId(), pageable);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/open")
    public Page<MessageDtos.AdminMessageView> getOpenedQuestions(Pageable pageable) {
        return messageService.getOpenedQuestions(pageable);
    }

    @PostMapping("/secure/add/message")
    public void postMessage(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody MessageDtos.NewMessageRequest messageRequest
    ) {
        messageService.postMessage(currentUser.getUser().getId(), messageRequest);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/secure/admin/reply")
    public void adminReply(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody MessageDtos.AdminReplyRequest adminReply
    ) {
        messageService.adminReply(currentUser.getUser().getId(), adminReply);
    }
}
