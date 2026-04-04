package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.dto.ReviewDto;
import com.luv2code.spring_boot_library.service.ReviewService;
import com.luv2code.spring_boot_library.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserService userService;


    @GetMapping("/secure/user/{bookId}")
    public Boolean reviewBookByUser(@PathVariable("bookId") Long bookId) throws Exception {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserIdByEmail(userEmail);
        return reviewService.userReviewListed(userId, bookId);
    }

    @PostMapping("/secure/user/book/{bookId}")
    public void postReview(@RequestBody ReviewDto.ReviewRequest reviewRequest, @PathVariable("bookId") Long bookId) throws Exception {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserIdByEmail(userEmail);
        reviewService.postReview(userId, bookId, reviewRequest);
    }
}
