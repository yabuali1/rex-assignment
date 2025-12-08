package com.assignment.rex_assignment_server.exception;

public class SpoonacularApiException extends RuntimeException {
    
    public SpoonacularApiException(String message) {
        super(message);
    }

    public SpoonacularApiException(String message, Throwable cause) {
        super(message, cause);
    }
}

