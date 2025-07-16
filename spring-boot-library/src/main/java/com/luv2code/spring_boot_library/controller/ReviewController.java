package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.entity.Review;
import com.luv2code.spring_boot_library.requestmodel.ReviewRequest;
import com.luv2code.spring_boot_library.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/secure/user/book")
    public Boolean reviewBookByUser(@RequestParam("bookId") Long bookId) throws Exception{
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        return reviewService.userReviewListed(userEmail, bookId);
    }

    @PostMapping("/secure")
    public void postReview(@RequestBody ReviewRequest reviewRequest) throws Exception{
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        reviewService.postReview(userEmail, reviewRequest);
    }
}
