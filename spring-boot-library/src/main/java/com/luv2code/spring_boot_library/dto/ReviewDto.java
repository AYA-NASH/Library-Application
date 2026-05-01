package com.luv2code.spring_boot_library.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import java.util.Optional;

public sealed interface ReviewDto {
    record ReviewRequest(
            @DecimalMin(value = "0.5", message = "Rating must be at least 0.5")
            @DecimalMax(value = "5.0", message = "Rating must be at most 5.0")
            double rating,
            Optional<String> reviewDescription
    ) implements ReviewDto {
    }

    record ReviewResponse(
            Long id,
            String userEmail,
            String date,
            double rating,
            Long bookId,
            String reviewDescription
    ) implements ReviewDto {
    }
}
