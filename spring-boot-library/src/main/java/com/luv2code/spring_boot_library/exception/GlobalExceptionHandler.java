package com.luv2code.spring_boot_library.exception;

import com.luv2code.spring_boot_library.dto.ErrorsDto;
import com.stripe.exception.StripeException;
import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    // ---------- Domain/business exceptions ----------
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorsDto.ApiErrorResponse> handleDuplicateResource(
            DuplicateResourceException ex, HttpServletRequest request
    ) {
        return build(HttpStatus.CONFLICT, "Conflict", ex.getMessage(), request, null);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorsDto.ApiErrorResponse> handleNotFound(
            ResourceNotFoundException ex, HttpServletRequest request
    ) {
        return build(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage(), request, null);
    }

    @ExceptionHandler(UnauthenticatedException.class)
    public ResponseEntity<ErrorsDto.ApiErrorResponse> handleUnauthenticated(
            UnauthenticatedException ex, HttpServletRequest request
    ) {
        return build(HttpStatus.UNAUTHORIZED, "Unauthorized", ex.getMessage(), request, null);
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ErrorsDto.ApiErrorResponse> handleForbidden(
            ForbiddenException ex, HttpServletRequest request) {
        return build(HttpStatus.FORBIDDEN, "Forbidden", ex.getMessage(), request, null);
    }

    // ---------- Cloudinary / file exceptions ----------
    @ExceptionHandler(InvalidFileTypeException.class)
    public ResponseEntity<ErrorsDto.ApiErrorResponse> handleInvalidFileType(
            InvalidFileTypeException ex, HttpServletRequest request
    ) {
        return build(HttpStatus.BAD_REQUEST, "Invalid File Type", ex.getMessage(), request, null);
    }

    @ExceptionHandler(CloudinaryUploadException.class)
    public ResponseEntity<ErrorsDto.ApiErrorResponse> handleUploadException(
            CloudinaryUploadException ex, HttpServletRequest request
    ) {

        return build(
                HttpStatus.BAD_GATEWAY,
                "Cloudinary Upload Failed",
                "Image/PDF upload service is temporarily unavailable. Please try again.",
                request,
                null
        );
    }

    @ExceptionHandler(CloudinaryDeleteException.class)
    public ResponseEntity<ErrorsDto.ApiErrorResponse> handleDeleteException(
            CloudinaryDeleteException ex, HttpServletRequest request
    ) {
        return build(
                HttpStatus.BAD_GATEWAY,
                "Cloudinary Delete Failed",
                "File deletion service is temporarily unavailable. Please try again.",
                request,
                null
        );
    }

    // ---------- Auth / payment ----------
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorsDto.ApiErrorResponse> handleBadCredentials(
            BadCredentialsException ex, HttpServletRequest request) {
        return build(HttpStatus.UNAUTHORIZED, "Unauthorized", "Incorrect email or password", request, null);
    }

    @ExceptionHandler(StripeException.class)
    public ResponseEntity<ErrorsDto.ApiErrorResponse> handleStripe(
            StripeException ex, HttpServletRequest request) {
        // Don't expose Stripe internals directly to clients
        return build(HttpStatus.PAYMENT_REQUIRED, "Payment Error",
                "Payment provider is unavailable or rejected the request.", request, null);
    }

    // ---------- Validation ----------
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorsDto.ApiErrorResponse> handleValidationErrors(
            MethodArgumentNotValidException ex, HttpServletRequest request
    ) {
        // Extract out all the broken fields and their error messages
        Map<String, String> errors = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        return build(HttpStatus.BAD_REQUEST, "Validation Error",
                "One or more fields are invalid.", request, errors);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorsDto.ApiErrorResponse> handleConstraintViolation(
            ConstraintViolationException ex, HttpServletRequest request
    ) {
        Map<String, String> errors = new LinkedHashMap<>();
        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            String path = violation.getPropertyPath() == null ? "unknown" : violation.getPropertyPath().toString();
            String field = path.contains(".") ? path.substring(path.lastIndexOf('.') + 1) : path;
            errors.put(field, violation.getMessage());
        }

        return build(
                HttpStatus.BAD_REQUEST,
                "Validation Error",
                "One or more request parameters are invalid.",
                request,
                errors
        );
    }

    // ---------- General client errors ----------
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorsDto.ApiErrorResponse> handleIllegalArgument(
            IllegalArgumentException ex, HttpServletRequest request
    ) {
        return build(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), request, null);
    }

    @ExceptionHandler(ExternalServiceException.class)
    public ResponseEntity<ErrorsDto.ApiErrorResponse> handleExternalException(
            ExternalServiceException ex, HttpServletRequest request
    ){
        return build( HttpStatus.SERVICE_UNAVAILABLE,
                "Service Unavailable",
                ex.getMessage(),
                request,
                null
        );
    }

    @ExceptionHandler(CallNotPermittedException.class)
    public ResponseEntity<ErrorsDto.ApiErrorResponse> handleCircuitOpen(
            CallNotPermittedException ex, HttpServletRequest request
    ) {
        return build(
                HttpStatus.SERVICE_UNAVAILABLE,
                "Service Unavailable",
                "Service is temporarily unavailable. Please retry shortly.",
                request,
                null
        );
    }

    // ---------- Internal failures ----------
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorsDto.ApiErrorResponse> handleUnexpected(
            Exception ex, HttpServletRequest request
    ) {
        return build(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Internal Server Error",
                "An unexpected error occurred. Please try again later.",
                request,
                null
        );
    }

    private ResponseEntity<ErrorsDto.ApiErrorResponse> build(
            HttpStatus status, String error, String message, HttpServletRequest request, Map<String, String> fieldErrors
    ) {
        ErrorsDto.ApiErrorResponse payload = new ErrorsDto.ApiErrorResponse(
                status.value(),
                error,
                message,
                request.getRequestURI(),
                fieldErrors
        );

        return new ResponseEntity<>(payload, status);
    }
}
