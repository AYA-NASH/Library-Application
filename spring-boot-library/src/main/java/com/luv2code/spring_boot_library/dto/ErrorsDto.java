package com.luv2code.spring_boot_library.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.Map;

public sealed interface ErrorsDto {

    @Schema(description = "Standardized error response object")
    record ApiErrorResponse(
            @Schema(description = "Timestamp of the error", example = "2024-04-22T10:00:00")
            LocalDateTime timestamp,
            @Schema(description = "HTTP Status Code", example = "400")
            int status,
            @Schema(description = "Error type", example = "Bad Request")
            String error,
            @Schema(description = "Detailed error message", example = "Book not found")
            String message,
            @Schema(description = "API path where error occurred", example = "/api/books/99")
            String path,
            @Schema(description = "Map of field-specific validation errors (if applicable)")
            Map<String, String> validationErrors
    ) implements ErrorsDto {
        public ApiErrorResponse(int status, String error, String message, String path) {
            this(LocalDateTime.now(), status, error, message, path, null);
        }

        public ApiErrorResponse(
                int status, String error, String message, String path, Map<String, String> validationErrors
        ) {
            this(LocalDateTime.now(), status, error, message, path, validationErrors);
        }
    }
}
