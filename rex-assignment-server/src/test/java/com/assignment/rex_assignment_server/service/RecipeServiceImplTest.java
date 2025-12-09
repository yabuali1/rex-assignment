package com.assignment.rex_assignment_server.service;

import com.assignment.rex_assignment_server.dto.*;
import com.assignment.rex_assignment_server.exception.RecipeNotFoundException;
import com.assignment.rex_assignment_server.exception.SpoonacularApiException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("RecipeServiceImpl Tests")
class RecipeServiceImplTest {

    @Mock
    private RestClient restClient;

    @Mock
    private RestClient.RequestHeadersUriSpec requestHeadersUriSpec;

    @Mock
    private RestClient.RequestHeadersSpec requestHeadersSpec;

    @Mock
    private RestClient.ResponseSpec responseSpec;

    private RecipeServiceImpl recipeService;

    @BeforeEach
    void setUp() {
        recipeService = new RecipeServiceImpl(restClient);
    }

    @Nested
    @DisplayName("searchRecipes")
    class SearchRecipesTests {

        @Test
        @DisplayName("should return recipes when search is successful")
        void shouldReturnRecipesWhenSearchIsSuccessful() {
            // Arrange
            RecipeSearchResponse expectedResponse = createMockSearchResponse();

            when(restClient.get()).thenReturn(requestHeadersUriSpec);
            when(requestHeadersUriSpec.uri(anyString())).thenReturn(requestHeadersSpec);
            when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
            when(responseSpec.body(RecipeSearchResponse.class)).thenReturn(expectedResponse);

            // Act
            RecipeSearchResponse result = recipeService.searchRecipes(
                    "pasta", null, null, null, 0, 12);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getTotalResults()).isEqualTo(100);
            assertThat(result.getResults()).hasSize(2);
            assertThat(result.getResults().get(0).getTitle()).isEqualTo("Pasta Carbonara");
        }

        @Test
        @DisplayName("should include diet filter in query when provided")
        void shouldIncludeDietFilterWhenProvided() {
            // Arrange
            RecipeSearchResponse expectedResponse = createMockSearchResponse();

            when(restClient.get()).thenReturn(requestHeadersUriSpec);
            when(requestHeadersUriSpec.uri(anyString())).thenReturn(requestHeadersSpec);
            when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
            when(responseSpec.body(RecipeSearchResponse.class)).thenReturn(expectedResponse);

            // Act
            recipeService.searchRecipes("pasta", "vegetarian", null, null, 0, 12);

            // Assert
            verify(requestHeadersUriSpec).uri(contains("diet=vegetarian"));
        }

        @Test
        @DisplayName("should include cuisine filter in query when provided")
        void shouldIncludeCuisineFilterWhenProvided() {
            // Arrange
            RecipeSearchResponse expectedResponse = createMockSearchResponse();

            when(restClient.get()).thenReturn(requestHeadersUriSpec);
            when(requestHeadersUriSpec.uri(anyString())).thenReturn(requestHeadersSpec);
            when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
            when(responseSpec.body(RecipeSearchResponse.class)).thenReturn(expectedResponse);

            // Act
            recipeService.searchRecipes("pasta", null, "italian", null, 0, 12);

            // Assert
            verify(requestHeadersUriSpec).uri(contains("cuisine=italian"));
        }

        @Test
        @DisplayName("should include type filter in query when provided")
        void shouldIncludeTypeFilterWhenProvided() {
            // Arrange
            RecipeSearchResponse expectedResponse = createMockSearchResponse();

            when(restClient.get()).thenReturn(requestHeadersUriSpec);
            when(requestHeadersUriSpec.uri(anyString())).thenReturn(requestHeadersSpec);
            when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
            when(responseSpec.body(RecipeSearchResponse.class)).thenReturn(expectedResponse);

            // Act
            recipeService.searchRecipes("pasta", null, null, "main course", 0, 12);

            // Assert
            verify(requestHeadersUriSpec).uri(contains("type=main course"));
        }

        @Test
        @DisplayName("should throw SpoonacularApiException when API call fails")
        void shouldThrowExceptionWhenApiCallFails() {
            // Arrange
            when(restClient.get()).thenReturn(requestHeadersUriSpec);
            when(requestHeadersUriSpec.uri(anyString())).thenReturn(requestHeadersSpec);
            when(requestHeadersSpec.retrieve()).thenThrow(new RestClientException("API Error"));

            // Act & Assert
            assertThatThrownBy(() -> recipeService.searchRecipes("pasta", null, null, null, 0, 12))
                    .isInstanceOf(SpoonacularApiException.class)
                    .hasMessageContaining("Failed to search recipes");
        }

        @Test
        @DisplayName("should handle null query gracefully")
        void shouldHandleNullQueryGracefully() {
            // Arrange
            RecipeSearchResponse expectedResponse = createMockSearchResponse();

            when(restClient.get()).thenReturn(requestHeadersUriSpec);
            when(requestHeadersUriSpec.uri(anyString())).thenReturn(requestHeadersSpec);
            when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
            when(responseSpec.body(RecipeSearchResponse.class)).thenReturn(expectedResponse);

            // Act
            RecipeSearchResponse result = recipeService.searchRecipes(null, null, null, null, 0, 12);

            // Assert
            assertThat(result).isNotNull();
        }
    }

    @Nested
    @DisplayName("getRecipeById")
    class GetRecipeByIdTests {

        @Test
        @DisplayName("should return recipe details when found")
        void shouldReturnRecipeDetailsWhenFound() {
            // Arrange
            RecipeDetailResponse expectedResponse = createMockRecipeDetail();

            when(restClient.get()).thenReturn(requestHeadersUriSpec);
            when(requestHeadersUriSpec.uri(anyString(), eq(123L))).thenReturn(requestHeadersSpec);
            when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
            when(responseSpec.body(RecipeDetailResponse.class)).thenReturn(expectedResponse);

            // Act
            RecipeDetailResponse result = recipeService.getRecipeById(123L);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(123L);
            assertThat(result.getTitle()).isEqualTo("Pasta Carbonara");
            assertThat(result.getReadyInMinutes()).isEqualTo(30);
        }

        @Test
        @DisplayName("should throw RecipeNotFoundException when response is null")
        void shouldThrowNotFoundWhenResponseIsNull() {
            // Arrange
            when(restClient.get()).thenReturn(requestHeadersUriSpec);
            when(requestHeadersUriSpec.uri(anyString(), eq(999L))).thenReturn(requestHeadersSpec);
            when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
            when(responseSpec.body(RecipeDetailResponse.class)).thenReturn(null);

            // Act & Assert
            assertThatThrownBy(() -> recipeService.getRecipeById(999L))
                    .isInstanceOf(RecipeNotFoundException.class)
                    .hasMessageContaining("Recipe not found with id: 999");
        }

        @Test
        @DisplayName("should throw RecipeNotFoundException on 404 error")
        void shouldThrowNotFoundOn404Error() {
            // Arrange
            when(restClient.get()).thenReturn(requestHeadersUriSpec);
            when(requestHeadersUriSpec.uri(anyString(), eq(999L))).thenReturn(requestHeadersSpec);
            when(requestHeadersSpec.retrieve()).thenThrow(new RestClientException("404 Not Found"));

            // Act & Assert
            assertThatThrownBy(() -> recipeService.getRecipeById(999L))
                    .isInstanceOf(RecipeNotFoundException.class);
        }

        @Test
        @DisplayName("should throw SpoonacularApiException on other API errors")
        void shouldThrowApiExceptionOnOtherErrors() {
            // Arrange
            when(restClient.get()).thenReturn(requestHeadersUriSpec);
            when(requestHeadersUriSpec.uri(anyString(), eq(123L))).thenReturn(requestHeadersSpec);
            when(requestHeadersSpec.retrieve()).thenThrow(new RestClientException("500 Server Error"));

            // Act & Assert
            assertThatThrownBy(() -> recipeService.getRecipeById(123L))
                    .isInstanceOf(SpoonacularApiException.class)
                    .hasMessageContaining("Failed to fetch recipe");
        }
    }

    @Nested
    @DisplayName("getRecipeWithExcludedIngredients")
    class GetRecipeWithExcludedIngredientsTests {

        @Test
        @DisplayName("should return original recipe when no ingredients excluded")
        void shouldReturnOriginalRecipeWhenNoExclusions() {
            // Arrange
            RecipeDetailResponse expectedResponse = createMockRecipeDetailWithNutrition();

            when(restClient.get()).thenReturn(requestHeadersUriSpec);
            when(requestHeadersUriSpec.uri(anyString(), eq(123L))).thenReturn(requestHeadersSpec);
            when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
            when(responseSpec.body(RecipeDetailResponse.class)).thenReturn(expectedResponse);

            // Act
            RecipeDetailResponse result = recipeService.getRecipeWithExcludedIngredients(123L, null);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getExtendedIngredients()).hasSize(3);
        }

        @Test
        @DisplayName("should return original recipe when empty exclusion list")
        void shouldReturnOriginalRecipeWhenEmptyExclusionList() {
            // Arrange
            RecipeDetailResponse expectedResponse = createMockRecipeDetailWithNutrition();

            when(restClient.get()).thenReturn(requestHeadersUriSpec);
            when(requestHeadersUriSpec.uri(anyString(), eq(123L))).thenReturn(requestHeadersSpec);
            when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
            when(responseSpec.body(RecipeDetailResponse.class)).thenReturn(expectedResponse);

            // Act
            RecipeDetailResponse result = recipeService.getRecipeWithExcludedIngredients(123L, List.of());

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getExtendedIngredients()).hasSize(3);
        }

        @Test
        @DisplayName("should reduce nutrition proportionally when ingredients excluded")
        void shouldReduceNutritionWhenIngredientsExcluded() {
            // Arrange
            RecipeDetailResponse mockResponse = createMockRecipeDetailWithNutrition();
            Double originalCalories = mockResponse.getNutrition().getNutrients().get(0).getAmount();

            when(restClient.get()).thenReturn(requestHeadersUriSpec);
            when(requestHeadersUriSpec.uri(anyString(), eq(123L))).thenReturn(requestHeadersSpec);
            when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
            when(responseSpec.body(RecipeDetailResponse.class)).thenReturn(mockResponse);

            // Act - exclude 1 of 3 ingredients (33% reduction)
            RecipeDetailResponse result = recipeService.getRecipeWithExcludedIngredients(
                    123L, List.of("pasta"));

            // Assert
            assertThat(result).isNotNull();
            Double newCalories = result.getNutrition().getNutrients().get(0).getAmount();
            // Should be reduced by approximately 33%
            assertThat(newCalories).isLessThan(originalCalories);
        }

        @Test
        @DisplayName("should keep all ingredients in list (visual exclusion only)")
        void shouldKeepAllIngredientsInList() {
            // Arrange
            RecipeDetailResponse mockResponse = createMockRecipeDetailWithNutrition();

            when(restClient.get()).thenReturn(requestHeadersUriSpec);
            when(requestHeadersUriSpec.uri(anyString(), eq(123L))).thenReturn(requestHeadersSpec);
            when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
            when(responseSpec.body(RecipeDetailResponse.class)).thenReturn(mockResponse);

            // Act
            RecipeDetailResponse result = recipeService.getRecipeWithExcludedIngredients(
                    123L, List.of("pasta"));

            // Assert - all ingredients should still be in the list
            assertThat(result.getExtendedIngredients()).hasSize(3);
        }
    }

    @Nested
    @DisplayName("getAutocompleteSuggestions")
    class GetAutocompleteSuggestionsTests {

        @Test
        @DisplayName("should return suggestions when API call is successful")
        void shouldReturnSuggestionsWhenSuccessful() {
            // Arrange
            AutocompleteResult[] mockResults = {
                    AutocompleteResult.builder().id(1L).title("Pasta Carbonara").build(),
                    AutocompleteResult.builder().id(2L).title("Pasta Primavera").build()
            };

            when(restClient.get()).thenReturn(requestHeadersUriSpec);
            when(requestHeadersUriSpec.uri(anyString(), anyString(), anyInt())).thenReturn(requestHeadersSpec);
            when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
            when(responseSpec.body(AutocompleteResult[].class)).thenReturn(mockResults);

            // Act
            List<AutocompleteResult> result = recipeService.getAutocompleteSuggestions("pasta", 5);

            // Assert
            assertThat(result).hasSize(2);
            assertThat(result.get(0).getTitle()).isEqualTo("Pasta Carbonara");
        }

        @Test
        @DisplayName("should return empty list when query is null")
        void shouldReturnEmptyListWhenQueryIsNull() {
            // Act
            List<AutocompleteResult> result = recipeService.getAutocompleteSuggestions(null, 5);

            // Assert
            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("should return empty list when query is empty")
        void shouldReturnEmptyListWhenQueryIsEmpty() {
            // Act
            List<AutocompleteResult> result = recipeService.getAutocompleteSuggestions("", 5);

            // Assert
            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("should return empty list when query is whitespace only")
        void shouldReturnEmptyListWhenQueryIsWhitespace() {
            // Act
            List<AutocompleteResult> result = recipeService.getAutocompleteSuggestions("   ", 5);

            // Assert
            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("should return empty list on API error (graceful failure)")
        void shouldReturnEmptyListOnApiError() {
            // Arrange
            when(restClient.get()).thenReturn(requestHeadersUriSpec);
            when(requestHeadersUriSpec.uri(anyString(), anyString(), anyInt())).thenReturn(requestHeadersSpec);
            when(requestHeadersSpec.retrieve()).thenThrow(new RestClientException("API Error"));

            // Act
            List<AutocompleteResult> result = recipeService.getAutocompleteSuggestions("pasta", 5);

            // Assert - should fail gracefully
            assertThat(result).isEmpty();
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

    private RecipeDetailResponse createMockRecipeDetailWithNutrition() {
        Ingredient ing1 = Ingredient.builder().id(1L).name("pasta").original("200g pasta").build();
        Ingredient ing2 = Ingredient.builder().id(2L).name("eggs").original("2 eggs").build();
        Ingredient ing3 = Ingredient.builder().id(3L).name("cheese").original("100g parmesan").build();

        Nutrient calories = Nutrient.builder()
                .name("Calories")
                .amount(500.0)
                .unit("kcal")
                .percentOfDailyNeeds(25.0)
                .build();

        Nutrient protein = Nutrient.builder()
                .name("Protein")
                .amount(20.0)
                .unit("g")
                .percentOfDailyNeeds(40.0)
                .build();

        NutritionInfo nutrition = NutritionInfo.builder()
                .nutrients(Arrays.asList(calories, protein))
                .build();

        return RecipeDetailResponse.builder()
                .id(123L)
                .title("Pasta Carbonara")
                .image("https://example.com/pasta.jpg")
                .servings(4)
                .readyInMinutes(30)
                .extendedIngredients(Arrays.asList(ing1, ing2, ing3))
                .nutrition(nutrition)
                .healthScore(65)
                .build();
    }
}
