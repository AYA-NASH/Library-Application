package com.luv2code.spring_boot_library.exception;

public class BookCurrentlyCheckedOutException extends RuntimeException {
    public BookCurrentlyCheckedOutException(String message) {
        super(message);
    }
}
