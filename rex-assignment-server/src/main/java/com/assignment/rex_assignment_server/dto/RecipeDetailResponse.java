package com.assignment.rex_assignment_server.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class RecipeDetailResponse {
    private Long id;
    private String title;
    private String image;
    private Integer servings;
    private Integer readyInMinutes;
    private String summary;
    private String instructions;
    private String sourceUrl;
    private List<String> dishTypes;
    private List<String> diets;
    private List<String> cuisines;
    private List<Ingredient> extendedIngredients;
    private NutritionInfo nutrition;
    private Boolean vegetarian;
    private Boolean vegan;
    private Boolean glutenFree;
    private Boolean dairyFree;
    private Boolean veryHealthy;
    private Boolean cheap;
    private Boolean veryPopular;
    private Integer healthScore;
    private Double pricePerServing;
}
