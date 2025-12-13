package com.assignment.rex_assignment_server.controller;

import com.assignment.rex_assignment_server.dto.AutocompleteResult;
import com.assignment.rex_assignment_server.dto.RecipeDetailResponse;
import com.assignment.rex_assignment_server.dto.RecipeSearchResponse;
import com.assignment.rex_assignment_server.service.RecipeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
@Slf4j
public class RecipeController {

    private final RecipeService recipeService;

    /**
     * Search for recipes with optional filters
     * 
     * @param query   Search query string
     * @param diet    Diet filter (e.g., vegetarian, vegan, gluten free)
     * @param cuisine Cuisine filter (e.g., italian, mexican, chinese)
     * @param type    Meal type filter (e.g., main course, side dish, dessert)
     * @param offset  Pagination offset
     * @param number  Number of results to return
     * @return List of matching recipes
     */
    @GetMapping("/search")
    public ResponseEntity<RecipeSearchResponse> searchRecipes(
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(required = false) String diet,
            @RequestParam(required = false) String cuisine,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "12") int number) {
        log.info("Search request - query: {}, diet: {}, cuisine: {}, type: {}",
                query, diet, cuisine, type);

        // Validate number parameter
        if (number < 1 || number > 100) {
            number = 12;
        }

        RecipeSearchResponse response = recipeService.searchRecipes(
                query, diet, cuisine, type, offset, number);

        return ResponseEntity.ok(response);
    }

    /**
     * Get detailed recipe information by ID
     * 
     * @param id Recipe ID
     * @return Detailed recipe information including nutrition
     */
    @GetMapping("/{id}")
    public ResponseEntity<RecipeDetailResponse> getRecipeById(@PathVariable Long id) {
        log.info("Get recipe request - id: {}", id);

        RecipeDetailResponse response = recipeService.getRecipeById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Get autocomplete suggestions for recipe search
     * 
     * @param query  Search query string
     * @param number Number of suggestions to return (default 5)
     * @return List of recipe suggestions
     */
    @GetMapping("/autocomplete")
    public ResponseEntity<List<AutocompleteResult>> getAutocompleteSuggestions(
            @RequestParam String query,
            @RequestParam(defaultValue = "5") int number) {
        log.info("Autocomplete request - query: {}", query);

        List<AutocompleteResult> suggestions = recipeService.getAutocompleteSuggestions(query, number);
        return ResponseEntity.ok(suggestions);
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Recipe API is running");
    }
}
