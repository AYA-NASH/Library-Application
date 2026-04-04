package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.dto.MessageDtos;
import com.luv2code.spring_boot_library.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/messages")
public class MessagesController {
    private MessageService messageService;

    @Autowired
    public MessagesController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/secure/add/message")
    public void postMessage(@RequestBody MessageDtos.UserMessageRequest messageRequest) {
        messageService.postMessage(messageRequest);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/secure/admin/message")
    public void putMessage(@RequestBody MessageDtos.AdminMessageResponse adminResponse) {
        messageService.putMessage(adminResponse);
    }
}
