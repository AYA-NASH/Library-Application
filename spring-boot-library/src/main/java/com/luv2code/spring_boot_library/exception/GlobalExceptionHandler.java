package com.luv2code.spring_boot_library.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CloudinaryUploadException.class)
    public ResponseEntity<Object> handleUploadException(CloudinaryUploadException ex){

        Map<String, Object> body = Map.of(
                "timestamp", LocalDateTime.now(),
                "error", "Cloudinary Upload Failed",
                "message", ex.getMessage()
        );

        return new ResponseEntity<>(body, HttpStatus.BAD_GATEWAY);
    }

    @ExceptionHandler(CloudinaryDeleteException.class)
    public ResponseEntity<Object> handleDeleteException(CloudinaryDeleteException ex){

        Map<String, Object> body = Map.of(
                "timestamp", LocalDateTime.now(),
                "error", "Cloudinary Delete Failed",
                "message", ex.getMessage()
        );

        return new ResponseEntity<>(body, HttpStatus.BAD_GATEWAY);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> handleRuntimeException(RuntimeException ex){

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
}
