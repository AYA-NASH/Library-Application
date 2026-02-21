package com.luv2code.spring_boot_library.exception;

public class CloudinaryDeleteException extends RuntimeException{

    public CloudinaryDeleteException(String message, Throwable cause){
        super(message,cause);
    }
}
