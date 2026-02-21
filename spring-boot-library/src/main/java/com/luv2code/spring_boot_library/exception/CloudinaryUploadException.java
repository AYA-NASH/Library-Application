package com.luv2code.spring_boot_library.exception;

public class CloudinaryUploadException extends RuntimeException{

    public CloudinaryUploadException(String message, Throwable cause){
        super(message, cause);
    }
}
