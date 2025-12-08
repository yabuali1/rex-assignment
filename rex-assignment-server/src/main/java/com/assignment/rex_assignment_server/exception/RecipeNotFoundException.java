package com.assignment.rex_assignment_server.exception;

public class RecipeNotFoundException extends RuntimeException {
    
    public RecipeNotFoundException(String message) {
        super(message);
    }

    public RecipeNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}

