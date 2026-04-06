package com.luv2code.spring_boot_library.exception;

import com.luv2code.spring_boot_library.dto.ErrorsDto;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import jakarta.validation.ConstraintViolationException;
import com.stripe.exception.StripeException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CloudinaryUploadException.class)
    public ResponseEntity<Object> handleUploadException(CloudinaryUploadException ex) {

        Map<String, Object> body = Map.of(
                "timestamp", LocalDateTime.now(),
                "error", "Cloudinary Upload Failed",
                "message", ex.getMessage()
        );

        return new ResponseEntity<>(body, HttpStatus.BAD_GATEWAY);
    }

    @ExceptionHandler(CloudinaryDeleteException.class)
    public ResponseEntity<Object> handleDeleteException(CloudinaryDeleteException ex) {

        Map<String, Object> body = Map.of(
                "timestamp", LocalDateTime.now(),
                "error", "Cloudinary Delete Failed",
                "message", ex.getMessage()
        );

        return new ResponseEntity<>(body, HttpStatus.BAD_GATEWAY);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleIllegalArgument(IllegalArgumentException ex) {
        Map<String, Object> body = Map.of(
                "timestamp", LocalDateTime.now(),
                "error", "Bad Request",
                "message", ex.getMessage()
        );
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> handleRuntimeException(RuntimeException ex) {

        Map<String, Object> body = Map.of(
                "timestamp", LocalDateTime.now(),
                "error", "Internal Server Error",
                "message", ex.getMessage()
        );

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(InvalidFileTypeException.class)
    public ResponseEntity<Object> handleInvalidFileType(InvalidFileTypeException ex) {

        Map<String, Object> body = Map.of(
                "timestamp", LocalDateTime.now(),
                "error", "Invalid File Type",
                "message", ex.getMessage()
        );

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UnauthenticatedException.class)
    public ResponseEntity<Object> handleUnauthenticated(UnauthenticatedException ex) {
        Map<String, Object> body = Map.of(
                "timestamp", LocalDateTime.now(),
                "error", "Unauthorized",
                "message", ex.getMessage()
        );

        return new ResponseEntity<>(body, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<Object> handleForbidden(ForbiddenException ex) {

        Map<String, Object> body = Map.of(
                "timestamp", LocalDateTime.now(),
                "error", "Forbidden",
                "message", ex.getMessage()
        );

        return new ResponseEntity<>(body, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleException(Exception ex) {
        Map<String, Object> body = Map.of(
                "timestamp", LocalDateTime.now(),
                "error", "Error",
                "message", ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred"
        );
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorsDto.ApiErrorResponse> handleDuplicateResource(
            DuplicateResourceException ex, HttpServletRequest request) {
        ErrorsDto.ApiErrorResponse error = new ErrorsDto.ApiErrorResponse(
                HttpStatus.CONFLICT.value(),
                "conflict",
                ex.getMessage(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorsDto.ApiErrorResponse> handleNotFound(
            ResourceNotFoundException ex, HttpServletRequest request) {
        ErrorsDto.ApiErrorResponse error = new ErrorsDto.ApiErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                "Not Found",
                ex.getMessage(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    // Catch `@Valid` Validation Failures automatically
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorsDto.ApiErrorResponse> handleValidationErrors(
            MethodArgumentNotValidException ex, HttpServletRequest request) {

        // Extract out all the broken fields and their error messages
        Map<String, String> errors = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        // Return a 400 Bad Request and attach the Map of exactly what fields are broken
        ErrorsDto.ApiErrorResponse errorResponse = new ErrorsDto.ApiErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Validation Error",
                "One or more fields are invalid",
                request.getRequestURI(),
                errors
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorsDto.ApiErrorResponse> handleBadCredentials(Exception ex, HttpServletRequest request) {
        ErrorsDto.ApiErrorResponse error = new ErrorsDto.ApiErrorResponse(
                HttpStatus.UNAUTHORIZED.value(), "Unauthorized", "Incorrect email or password", request.getRequestURI());
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> handleConstraintViolation(ConstraintViolationException ex) {
        Map<String, Object> body = Map.of(
                "timestamp", LocalDateTime.now(),
                "error", "Bad Request",
                "message", ex.getMessage()
        );
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(StripeException.class)
    public ResponseEntity<ErrorsDto.ApiErrorResponse> handleStripeException(StripeException ex, HttpServletRequest request) {
        ErrorsDto.ApiErrorResponse error = new ErrorsDto.ApiErrorResponse(
                HttpStatus.PAYMENT_REQUIRED.value(),
                "Payment Error",
                ex.getMessage(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.PAYMENT_REQUIRED);
    }
}
