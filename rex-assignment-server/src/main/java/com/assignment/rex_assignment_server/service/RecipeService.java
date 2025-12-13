package com.assignment.rex_assignment_server.service;

import com.assignment.rex_assignment_server.dto.AutocompleteResult;
import com.assignment.rex_assignment_server.dto.RecipeDetailResponse;
import com.assignment.rex_assignment_server.dto.RecipeSearchResponse;

import java.util.List;

public interface RecipeService {

    /**
     * Search for recipes based on query and optional filters
     */
    RecipeSearchResponse searchRecipes(
            String query,
            String diet,
            String cuisine,
            String type,
            int offset,
            int number);

    /**
     * Get detailed recipe information including nutrition
     */
    RecipeDetailResponse getRecipeById(Long id);

    /**
     * Get autocomplete suggestions for recipe search
     */
    List<AutocompleteResult> getAutocompleteSuggestions(String query, int number);
}
