package com.luv2code.spring_boot_library.dto;

import java.time.LocalDateTime;
import java.util.Map;

public sealed interface ErrorsDto {

    record ApiErrorResponse(
            LocalDateTime timestamp,
            int status,
            String error,
            String message,
            String path,
            Map<String, String> validationErrors
    ) implements ErrorsDto {
        public ApiErrorResponse(int status, String error, String message, String path) {
            this(LocalDateTime.now(), status, error, message, path, null);
        }
    }
}
