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
public class NutritionInfo {
    private List<Nutrient> nutrients;
    private List<Property> properties;
    private List<Flavonoid> flavonoids;
    private List<IngredientNutrition> ingredients;
    private CaloricBreakdown caloricBreakdown;
    private WeightPerServing weightPerServing;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
class CaloricBreakdown {
    private Double percentProtein;
    private Double percentFat;
    private Double percentCarbs;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
class WeightPerServing {
    private Double amount;
    private String unit;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
class Property {
    private String name;
    private Double amount;
    private String unit;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
class Flavonoid {
    private String name;
    private Double amount;
    private String unit;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
class IngredientNutrition {
    private Long id;
    private String name;
    private Double amount;
    private String unit;
    private List<Nutrient> nutrients;
}
