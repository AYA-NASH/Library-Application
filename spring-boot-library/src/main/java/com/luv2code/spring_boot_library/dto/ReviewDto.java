package com.luv2code.spring_boot_library.dto;

import java.util.Optional;

public sealed interface ReviewDto {
    record ReviewRequest(
            double rating,
            Optional<String> reviewDescription
    ) implements ReviewDto {
    }
}
