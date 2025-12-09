package com.assignment.rex_assignment_server.exception;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("GlobalExceptionHandler Tests")
class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler exceptionHandler;

    @BeforeEach
    void setUp() {
        exceptionHandler = new GlobalExceptionHandler();
    }

    @Test
    @DisplayName("should handle RecipeNotFoundException with 404 status")
    void shouldHandleRecipeNotFoundWith404() {
        // Arrange
        RecipeNotFoundException exception = new RecipeNotFoundException("Recipe not found with id: 123");

        // Act
        ResponseEntity<Map<String, Object>> response = exceptionHandler.handleRecipeNotFound(exception);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("status")).isEqualTo(404);
        assertThat(response.getBody().get("error")).isEqualTo("Not Found");
        assertThat(response.getBody().get("message")).isEqualTo("Recipe not found with id: 123");
        assertThat(response.getBody()).containsKey("timestamp");
    }

    @Test
    @DisplayName("should handle SpoonacularApiException with 503 status")
    void shouldHandleSpoonacularApiExceptionWith503() {
        // Arrange
        SpoonacularApiException exception = new SpoonacularApiException("API rate limit exceeded");

        // Act
        ResponseEntity<Map<String, Object>> response = exceptionHandler.handleSpoonacularApiException(exception);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("status")).isEqualTo(503);
        assertThat(response.getBody().get("error")).isEqualTo("Service Unavailable");
        String message = (String) response.getBody().get("message");
        assertThat(message).containsIgnoringCase("unavailable");
    }

    @Test
    @DisplayName("should handle IllegalArgumentException with 400 status")
    void shouldHandleIllegalArgumentExceptionWith400() {
        // Arrange
        IllegalArgumentException exception = new IllegalArgumentException("Invalid parameter value");

        // Act
        ResponseEntity<Map<String, Object>> response = exceptionHandler.handleIllegalArgument(exception);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("status")).isEqualTo(400);
        assertThat(response.getBody().get("error")).isEqualTo("Bad Request");
        assertThat(response.getBody().get("message")).isEqualTo("Invalid parameter value");
    }

    @Test
    @DisplayName("should handle generic Exception with 500 status")
    void shouldHandleGenericExceptionWith500() {
        // Arrange
        Exception exception = new RuntimeException("Unexpected error");

        // Act
        ResponseEntity<Map<String, Object>> response = exceptionHandler.handleGenericException(exception);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("status")).isEqualTo(500);
        assertThat(response.getBody().get("error")).isEqualTo("Internal Server Error");
        String message = (String) response.getBody().get("message");
        assertThat(message).containsIgnoringCase("unexpected");
    }

    @Test
    @DisplayName("error response should include timestamp")
    void errorResponseShouldIncludeTimestamp() {
        // Arrange
        RecipeNotFoundException exception = new RecipeNotFoundException("Test");

        // Act
        ResponseEntity<Map<String, Object>> response = exceptionHandler.handleRecipeNotFound(exception);

        // Assert
        assertThat(response.getBody()).containsKey("timestamp");
        assertThat(response.getBody().get("timestamp")).isNotNull();
    }
}
