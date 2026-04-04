package com.luv2code.spring_boot_library.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public sealed interface InteractionDtos {

    record ProgressRequest(
            @NotNull(message = "Page number is required")
            @Min(value = 1, message = "Page number must be at least 1")
            Integer page
    ) implements InteractionDtos {
    }

    record ProgressResponse(
            Integer page,
            LocalDateTime lastOpenedAt
    ) implements InteractionDtos {
    }
}