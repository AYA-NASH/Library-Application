package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.entity.AppUser;
import com.luv2code.spring_boot_library.entity.UserPrincipal;
import com.luv2code.spring_boot_library.requestmodel.ReadingProgressRequest;
import com.luv2code.spring_boot_library.service.UserBookInteractionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interactions/secure/book/")
public class UserBookInteractionController {
    private UserBookInteractionService service;

    @Autowired
    public UserBookInteractionController(UserBookInteractionService service){
        this.service = service;
    }

    @GetMapping("/{bookId}/last-page")
    public ResponseEntity<Integer> getLastReadPage(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable("bookId") Long bookId){

        Integer page = service.getLastReadPage(user.getUser().getId(), bookId);

        return ResponseEntity.ok(page);
    }

    @PutMapping("/{bookId}/interact")
    public ResponseEntity<Void> updateLastReadPage(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable("bookId") Long bookId,
            @RequestBody ReadingProgressRequest request){

        service.updateLastReadPage(user.getUser().getId(), bookId, request.getPage());

        return ResponseEntity.ok().build();
    }

}
