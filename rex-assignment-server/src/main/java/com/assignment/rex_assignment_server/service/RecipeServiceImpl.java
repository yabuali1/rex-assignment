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
