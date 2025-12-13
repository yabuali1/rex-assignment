package com.assignment.rex_assignment_server.controller;

import com.assignment.rex_assignment_server.dto.*;
import com.assignment.rex_assignment_server.exception.RecipeNotFoundException;
import com.assignment.rex_assignment_server.exception.SpoonacularApiException;
import com.assignment.rex_assignment_server.service.RecipeService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RecipeController.class)
@Import(com.assignment.rex_assignment_server.config.SecurityConfig.class)
@DisplayName("RecipeController Tests")
class RecipeControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @MockitoBean
        private RecipeService recipeService;

        @Nested
        @DisplayName("GET /api/recipes/search")
        class SearchRecipesTests {

                @Test
                @WithMockUser
                @DisplayName("should return 200 and recipes when search is successful")
                void shouldReturnRecipesOnSuccessfulSearch() throws Exception {
                        // Arrange
                        RecipeSearchResponse mockResponse = createMockSearchResponse();
                        when(recipeService.searchRecipes(anyString(), any(), any(), any(), anyInt(), anyInt()))
                                        .thenReturn(mockResponse);

                        // Act & Assert
                        mockMvc.perform(get("/api/recipes/search")
                                        .param("query", "pasta"))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$.totalResults", is(100)))
                                        .andExpect(jsonPath("$.results", hasSize(2)))
                                        .andExpect(jsonPath("$.results[0].title", is("Pasta Carbonara")));
                }

                @Test
                @WithMockUser
                @DisplayName("should return 200 with filters applied")
                void shouldReturnRecipesWithFilters() throws Exception {
                        // Arrange
                        RecipeSearchResponse mockResponse = createMockSearchResponse();
                        when(recipeService.searchRecipes(eq("pasta"), eq("vegetarian"), eq("italian"),
                                        eq("main course"), anyInt(),
                                        anyInt()))
                                        .thenReturn(mockResponse);

                        // Act & Assert
                        mockMvc.perform(get("/api/recipes/search")
                                        .param("query", "pasta")
                                        .param("diet", "vegetarian")
                                        .param("cuisine", "italian")
                                        .param("type", "main course"))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$.results", hasSize(2)));
                }

                @Test
                @WithMockUser
                @DisplayName("should return 200 with default values when no params provided")
                void shouldReturnWithDefaultValues() throws Exception {
                        // Arrange
                        RecipeSearchResponse mockResponse = createMockSearchResponse();
                        when(recipeService.searchRecipes(eq(""), isNull(), isNull(), isNull(), eq(0), eq(12)))
                                        .thenReturn(mockResponse);

                        // Act & Assert
                        mockMvc.perform(get("/api/recipes/search"))
                                        .andExpect(status().isOk());
                }

                @Test
                @WithMockUser
                @DisplayName("should handle pagination parameters")
                void shouldHandlePaginationParameters() throws Exception {
                        // Arrange
                        RecipeSearchResponse mockResponse = createMockSearchResponse();
                        when(recipeService.searchRecipes(anyString(), any(), any(), any(), eq(24), eq(12)))
                                        .thenReturn(mockResponse);

                        // Act & Assert
                        mockMvc.perform(get("/api/recipes/search")
                                        .param("query", "pasta")
                                        .param("offset", "24")
                                        .param("number", "12"))
                                        .andExpect(status().isOk());
                }

                @Test
                @WithMockUser
                @DisplayName("should return 503 when external API fails")
                void shouldReturn503WhenApiFails() throws Exception {
                        // Arrange
                        when(recipeService.searchRecipes(anyString(), any(), any(), any(), anyInt(), anyInt()))
                                        .thenThrow(new SpoonacularApiException("API unavailable"));

                        // Act & Assert
                        mockMvc.perform(get("/api/recipes/search")
                                        .param("query", "pasta"))
                                        .andExpect(status().isServiceUnavailable())
                                        .andExpect(jsonPath("$.message", containsString("unavailable")));
                }
        }

        @Nested
        @DisplayName("GET /api/recipes/{id}")
        class GetRecipeByIdTests {

                @Test
                @WithMockUser
                @DisplayName("should return 200 and recipe details when found")
                void shouldReturnRecipeDetailsWhenFound() throws Exception {
                        // Arrange
                        RecipeDetailResponse mockResponse = createMockRecipeDetail();
                        when(recipeService.getRecipeById(123L)).thenReturn(mockResponse);

                        // Act & Assert
                        mockMvc.perform(get("/api/recipes/123"))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$.id", is(123)))
                                        .andExpect(jsonPath("$.title", is("Pasta Carbonara")))
                                        .andExpect(jsonPath("$.readyInMinutes", is(30)))
                                        .andExpect(jsonPath("$.servings", is(4)));
                }

                @Test
                @WithMockUser
                @DisplayName("should return 404 when recipe not found")
                void shouldReturn404WhenRecipeNotFound() throws Exception {
                        // Arrange
                        when(recipeService.getRecipeById(999L))
                                        .thenThrow(new RecipeNotFoundException("Recipe not found with id: 999"));

                        // Act & Assert
                        mockMvc.perform(get("/api/recipes/999"))
                                        .andExpect(status().isNotFound())
                                        .andExpect(jsonPath("$.message", containsString("not found")));
                }

                @Test
                @WithMockUser
                @DisplayName("should return 503 when external API fails")
                void shouldReturn503WhenApiFails() throws Exception {
                        // Arrange
                        when(recipeService.getRecipeById(123L))
                                        .thenThrow(new SpoonacularApiException("API unavailable"));

                        // Act & Assert
                        mockMvc.perform(get("/api/recipes/123"))
                                        .andExpect(status().isServiceUnavailable());
                }
        }

        @Nested
        @DisplayName("GET /api/recipes/autocomplete")
        class AutocompleteTests {

                @Test
                @WithMockUser
                @DisplayName("should return 200 and suggestions when successful")
                void shouldReturnSuggestionsWhenSuccessful() throws Exception {
                        // Arrange
                        List<AutocompleteResult> mockResults = Arrays.asList(
                                        AutocompleteResult.builder().id(1L).title("Pasta Carbonara").build(),
                                        AutocompleteResult.builder().id(2L).title("Pasta Primavera").build());
                        when(recipeService.getAutocompleteSuggestions(eq("pasta"), eq(5))).thenReturn(mockResults);

                        // Act & Assert
                        mockMvc.perform(get("/api/recipes/autocomplete")
                                        .param("query", "pasta"))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$", hasSize(2)))
                                        .andExpect(jsonPath("$[0].title", is("Pasta Carbonara")));
                }

                @Test
                @WithMockUser
                @DisplayName("should use default number when not provided")
                void shouldUseDefaultNumber() throws Exception {
                        // Arrange
                        when(recipeService.getAutocompleteSuggestions(eq("pasta"), eq(5))).thenReturn(List.of());

                        // Act & Assert
                        mockMvc.perform(get("/api/recipes/autocomplete")
                                        .param("query", "pasta"))
                                        .andExpect(status().isOk());
                }

                @Test
                @WithMockUser
                @DisplayName("should return empty list on API error")
                void shouldReturnEmptyListOnError() throws Exception {
                        // Arrange
                        when(recipeService.getAutocompleteSuggestions(anyString(), anyInt())).thenReturn(List.of());

                        // Act & Assert
                        mockMvc.perform(get("/api/recipes/autocomplete")
                                        .param("query", "pasta"))
                                        .andExpect(status().isOk())
                                        .andExpect(jsonPath("$", hasSize(0)));
                }

                @Test
                @WithMockUser
                @DisplayName("should accept custom number parameter")
                void shouldAcceptCustomNumberParameter() throws Exception {
                        // Arrange
                        when(recipeService.getAutocompleteSuggestions(eq("pasta"), eq(10))).thenReturn(List.of());

                        // Act & Assert
                        mockMvc.perform(get("/api/recipes/autocomplete")
                                        .param("query", "pasta")
                                        .param("number", "10"))
                                        .andExpect(status().isOk());
                }
        }

        @Nested
        @DisplayName("GET /api/recipes/health")
        class HealthCheckTests {

                @Test
                @WithMockUser
                @DisplayName("should return 200 and health message")
                void shouldReturnHealthMessage() throws Exception {
                        // Act & Assert
                        mockMvc.perform(get("/api/recipes/health"))
                                        .andExpect(status().isOk())
                                        .andExpect(content().string("Recipe API is running"));
                }
        }

        // Helper methods to create mock data

        private RecipeSearchResponse createMockSearchResponse() {
                RecipeSearchResult result1 = RecipeSearchResult.builder()
                                .id(1L)
                                .title("Pasta Carbonara")
                                .image("https://example.com/pasta.jpg")
                                .build();

                RecipeSearchResult result2 = RecipeSearchResult.builder()
                                .id(2L)
                                .title("Pasta Primavera")
                                .image("https://example.com/primavera.jpg")
                                .build();

                return RecipeSearchResponse.builder()
                                .results(Arrays.asList(result1, result2))
                                .offset(0)
                                .number(12)
                                .totalResults(100)
                                .build();
        }

        private RecipeDetailResponse createMockRecipeDetail() {
                return RecipeDetailResponse.builder()
                                .id(123L)
                                .title("Pasta Carbonara")
                                .image("https://example.com/pasta.jpg")
                                .servings(4)
                                .readyInMinutes(30)
                                .summary("A classic Italian pasta dish")
                                .instructions("Cook pasta, add sauce...")
                                .vegetarian(false)
                                .vegan(false)
                                .glutenFree(false)
                                .healthScore(65)
                                .build();
        }
}
