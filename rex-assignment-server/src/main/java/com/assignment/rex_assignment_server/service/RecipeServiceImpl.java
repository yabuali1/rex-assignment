package com.assignment.rex_assignment_server.service;

import com.assignment.rex_assignment_server.dto.*;
import com.assignment.rex_assignment_server.exception.RecipeNotFoundException;
import com.assignment.rex_assignment_server.exception.SpoonacularApiException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecipeServiceImpl implements RecipeService {

    private final RestClient spoonacularRestClient;

    @Override
    public RecipeSearchResponse searchRecipes(
            String query,
            String diet,
            String cuisine,
            String type,
            int offset,
            int number) {
        log.debug("Searching recipes with query: {}, diet: {}, cuisine: {}, type: {}",
                query, diet, cuisine, type);

        try {
            StringBuilder uriBuilder = new StringBuilder("/recipes/complexSearch?");
            uriBuilder.append("query=").append(query != null ? query : "");
            uriBuilder.append("&offset=").append(offset);
            uriBuilder.append("&number=").append(number);
            uriBuilder.append("&addRecipeNutrition=true");

            if (diet != null && !diet.isBlank()) {
                uriBuilder.append("&diet=").append(diet);
            }
            if (cuisine != null && !cuisine.isBlank()) {
                uriBuilder.append("&cuisine=").append(cuisine);
            }
            if (type != null && !type.isBlank()) {
                uriBuilder.append("&type=").append(type);
            }

            RecipeSearchResponse response = spoonacularRestClient.get()
                    .uri(uriBuilder.toString())
                    .retrieve()
                    .body(RecipeSearchResponse.class);

            log.info("Found {} recipes for query: {}",
                    response != null ? response.getTotalResults() : 0, query);

            return response;

        } catch (RestClientException e) {
            log.error("Error calling Spoonacular API for search: {}", e.getMessage());
            throw new SpoonacularApiException("Failed to search recipes: " + e.getMessage());
        }
    }

    @Override
    public RecipeDetailResponse getRecipeById(Long id) {
        log.debug("Fetching recipe details for id: {}", id);

        try {
            RecipeDetailResponse response = spoonacularRestClient.get()
                    .uri("/recipes/{id}/information?includeNutrition=true", id)
                    .retrieve()
                    .body(RecipeDetailResponse.class);

            if (response == null) {
                throw new RecipeNotFoundException("Recipe not found with id: " + id);
            }

            log.info("Successfully fetched recipe: {}", response.getTitle());
            return response;

        } catch (RestClientException e) {
            log.error("Error fetching recipe {}: {}", id, e.getMessage());
            if (e.getMessage() != null && e.getMessage().contains("404")) {
                throw new RecipeNotFoundException("Recipe not found with id: " + id);
            }
            throw new SpoonacularApiException("Failed to fetch recipe: " + e.getMessage());
        }
    }

    @Override
    public RecipeDetailResponse getRecipeWithExcludedIngredients(Long id, List<String> excludedIngredients) {
        log.debug("Fetching recipe {} with excluded ingredients: {}", id, excludedIngredients);

        RecipeDetailResponse recipe = getRecipeById(id);

        if (excludedIngredients == null || excludedIngredients.isEmpty()) {
            return recipe;
        }

        List<Ingredient> originalIngredients = recipe.getExtendedIngredients();
        if (originalIngredients == null) {
            return recipe;
        }

        // Count excluded ingredients for nutrition calculation
        List<String> excludedLower = excludedIngredients.stream()
                .map(String::toLowerCase)
                .collect(Collectors.toList());

        long excludedCount = originalIngredients.stream()
                .filter(ingredient -> {
                    String name = ingredient.getName();
                    if (name == null)
                        return false;
                    return excludedLower.stream()
                            .anyMatch(excluded -> name.toLowerCase().contains(excluded));
                })
                .count();

        int totalCount = originalIngredients.size();

        // Calculate nutrition reduction based on excluded ingredients
        // This is a simplified proportional calculation
        if (totalCount > 0 && excludedCount > 0 && recipe.getNutrition() != null) {
            double reductionRatio = (double) excludedCount / totalCount;
            NutritionInfo nutrition = recipe.getNutrition();

            // Adjust all nutrients in the array proportionally
            if (nutrition.getNutrients() != null) {
                nutrition.getNutrients().forEach(nutrient -> {
                    if (nutrient.getAmount() != null) {
                        double adjustedAmount = nutrient.getAmount() * (1 - reductionRatio);
                        nutrient.setAmount(Math.round(adjustedAmount * 100.0) / 100.0);
                    }

                    // Also adjust percent of daily needs
                    if (nutrient.getPercentOfDailyNeeds() != null) {
                        double adjustedPercent = nutrient.getPercentOfDailyNeeds() * (1 - reductionRatio);
                        nutrient.setPercentOfDailyNeeds(Math.round(adjustedPercent * 100.0) / 100.0);
                    }
                });
            }

            log.info("Reduced nutrition by {}% due to {} excluded ingredients",
                    Math.round(reductionRatio * 100), excludedCount);

            recipe.setNutrition(nutrition);
        }

        // Keep all ingredients in the list - frontend handles visual exclusion styling
        log.info("Recipe {} has {} total ingredients, {} excluded for nutrition calculation",
                id, totalCount, excludedCount);

        return recipe;
    }

    @Override
    public List<AutocompleteResult> getAutocompleteSuggestions(String query, int number) {
        log.debug("Getting autocomplete suggestions for: {}", query);

        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }

        try {
            AutocompleteResult[] results = spoonacularRestClient.get()
                    .uri("/recipes/autocomplete?query={query}&number={number}", query, number)
                    .retrieve()
                    .body(AutocompleteResult[].class);

            if (results == null) {
                return List.of();
            }

            log.info("Found {} autocomplete suggestions for: {}", results.length, query);
            return List.of(results);

        } catch (RestClientException e) {
            log.error("Error getting autocomplete suggestions: {}", e.getMessage());
            // Return empty list instead of throwing - autocomplete should fail gracefully
            return List.of();
        }
    }
}
