package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.dto.ReviewDto;
import com.luv2code.spring_boot_library.entity.UserPrincipal;
import com.luv2code.spring_boot_library.service.ReviewService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "User Interaction", description = "Endpoints for user reviews and ratings")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/secure/user/{bookId}")
    public Boolean reviewBookByUser(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable("bookId") @Positive Long bookId
    ) {
        return reviewService.userReviewListed(currentUser.getUser().getId(), bookId);
    }

    @PostMapping("/secure/user/book/{bookId}")
    public void postReview(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ReviewDto.ReviewRequest reviewRequest,
            @PathVariable("bookId") @Positive Long bookId
    ) {
        reviewService.postReview(currentUser.getUser().getId(), bookId, reviewRequest);
    }

    @GetMapping("/public/book/{bookId}")
    public Page<ReviewDto.ReviewResponse> getBookReviews(
            @PathVariable("bookId") @Positive Long bookId,
            Pageable pageable
    ) {
        return reviewService.getBookReviews(bookId, pageable);
    }
}
