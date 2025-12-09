package com.assignment.rex_assignment_server.dto;

import tools.jackson.databind.json.JsonMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("DTO Serialization Tests")
class DtoSerializationTest {

    private JsonMapper jsonMapper;

    @BeforeEach
    void setUp() {
        jsonMapper = JsonMapper.builder().build();
    }

    @Nested
    @DisplayName("RecipeSearchResponse")
    class RecipeSearchResponseTests {

        @Test
        @DisplayName("should serialize and deserialize correctly")
        void shouldSerializeAndDeserialize() throws Exception {
            // Arrange
            RecipeSearchResult result = RecipeSearchResult.builder()
                    .id(1L)
                    .title("Test Recipe")
                    .image("https://example.com/image.jpg")
                    .imageType("jpg")
                    .build();

            RecipeSearchResponse original = RecipeSearchResponse.builder()
                    .results(List.of(result))
                    .offset(0)
                    .number(10)
                    .totalResults(100)
                    .build();

            // Act
            String json = jsonMapper.writeValueAsString(original);
            RecipeSearchResponse deserialized = jsonMapper.readValue(json, RecipeSearchResponse.class);

            // Assert
            assertThat(deserialized.getTotalResults()).isEqualTo(100);
            assertThat(deserialized.getResults()).hasSize(1);
            assertThat(deserialized.getResults().get(0).getTitle()).isEqualTo("Test Recipe");
        }

        @Test
        @DisplayName("should handle null results")
        void shouldHandleNullResults() throws Exception {
            // Arrange
            RecipeSearchResponse original = RecipeSearchResponse.builder()
                    .results(null)
                    .offset(0)
                    .number(10)
                    .totalResults(0)
                    .build();

            // Act
            String json = jsonMapper.writeValueAsString(original);
            RecipeSearchResponse deserialized = jsonMapper.readValue(json, RecipeSearchResponse.class);

            // Assert
            assertThat(deserialized.getResults()).isNull();
            assertThat(deserialized.getTotalResults()).isEqualTo(0);
        }
    }

    @Nested
    @DisplayName("RecipeDetailResponse")
    class RecipeDetailResponseTests {

        @Test
        @DisplayName("should serialize and deserialize with all fields")
        void shouldSerializeAndDeserializeWithAllFields() throws Exception {
            // Arrange
            Ingredient ingredient = Ingredient.builder()
                    .id(1L)
                    .name("pasta")
                    .original("200g pasta")
                    .amount(200.0)
                    .unit("g")
                    .build();

            Nutrient nutrient = Nutrient.builder()
                    .name("Calories")
                    .amount(300.0)
                    .unit("kcal")
                    .percentOfDailyNeeds(15.0)
                    .build();

            NutritionInfo nutrition = NutritionInfo.builder()
                    .nutrients(List.of(nutrient))
                    .build();

            RecipeDetailResponse original = RecipeDetailResponse.builder()
                    .id(123L)
                    .title("Pasta Carbonara")
                    .image("https://example.com/pasta.jpg")
                    .servings(4)
                    .readyInMinutes(30)
                    .summary("A delicious pasta")
                    .instructions("Cook pasta...")
                    .vegetarian(true)
                    .vegan(false)
                    .glutenFree(false)
                    .dairyFree(false)
                    .healthScore(75)
                    .extendedIngredients(List.of(ingredient))
                    .nutrition(nutrition)
                    .cuisines(List.of("Italian"))
                    .dishTypes(List.of("main course"))
                    .build();

            // Act
            String json = jsonMapper.writeValueAsString(original);
            RecipeDetailResponse deserialized = jsonMapper.readValue(json, RecipeDetailResponse.class);

            // Assert
            assertThat(deserialized.getId()).isEqualTo(123L);
            assertThat(deserialized.getTitle()).isEqualTo("Pasta Carbonara");
            assertThat(deserialized.getVegetarian()).isTrue();
            assertThat(deserialized.getExtendedIngredients()).hasSize(1);
            assertThat(deserialized.getNutrition().getNutrients()).hasSize(1);
        }

        @Test
        @DisplayName("should handle nullable Boolean fields")
        void shouldHandleNullableBooleanFields() throws Exception {
            // Arrange
            RecipeDetailResponse original = RecipeDetailResponse.builder()
                    .id(123L)
                    .title("Test")
                    .vegetarian(null)
                    .vegan(null)
                    .build();

            // Act
            String json = jsonMapper.writeValueAsString(original);
            RecipeDetailResponse deserialized = jsonMapper.readValue(json, RecipeDetailResponse.class);

            // Assert
            assertThat(deserialized.getVegetarian()).isNull();
            assertThat(deserialized.getVegan()).isNull();
        }
    }

    @Nested
    @DisplayName("Ingredient")
    class IngredientTests {

        @Test
        @DisplayName("should serialize and deserialize correctly")
        void shouldSerializeAndDeserialize() throws Exception {
            // Arrange
            Ingredient original = Ingredient.builder()
                    .id(1L)
                    .name("flour")
                    .original("2 cups all-purpose flour")
                    .originalName("all-purpose flour")
                    .amount(2.0)
                    .unit("cups")
                    .image("flour.jpg")
                    .consistency("solid")
                    .aisle("Baking")
                    .build();

            // Act
            String json = jsonMapper.writeValueAsString(original);
            Ingredient deserialized = jsonMapper.readValue(json, Ingredient.class);

            // Assert
            assertThat(deserialized.getName()).isEqualTo("flour");
            assertThat(deserialized.getAmount()).isEqualTo(2.0);
            assertThat(deserialized.getUnit()).isEqualTo("cups");
        }
    }

    @Nested
    @DisplayName("Nutrient")
    class NutrientTests {

        @Test
        @DisplayName("should serialize and deserialize correctly")
        void shouldSerializeAndDeserialize() throws Exception {
            // Arrange
            Nutrient original = Nutrient.builder()
                    .name("Protein")
                    .amount(25.5)
                    .unit("g")
                    .percentOfDailyNeeds(51.0)
                    .build();

            // Act
            String json = jsonMapper.writeValueAsString(original);
            Nutrient deserialized = jsonMapper.readValue(json, Nutrient.class);

            // Assert
            assertThat(deserialized.getName()).isEqualTo("Protein");
            assertThat(deserialized.getAmount()).isEqualTo(25.5);
            assertThat(deserialized.getPercentOfDailyNeeds()).isEqualTo(51.0);
        }

        @Test
        @DisplayName("should handle nullable Double fields")
        void shouldHandleNullableDoubleFields() throws Exception {
            // Arrange
            Nutrient original = Nutrient.builder()
                    .name("Fiber")
                    .amount(null)
                    .percentOfDailyNeeds(null)
                    .build();

            // Act
            String json = jsonMapper.writeValueAsString(original);
            Nutrient deserialized = jsonMapper.readValue(json, Nutrient.class);

            // Assert
            assertThat(deserialized.getAmount()).isNull();
            assertThat(deserialized.getPercentOfDailyNeeds()).isNull();
        }
    }

    @Nested
    @DisplayName("AutocompleteResult")
    class AutocompleteResultTests {

        @Test
        @DisplayName("should serialize and deserialize correctly")
        void shouldSerializeAndDeserialize() throws Exception {
            // Arrange
            AutocompleteResult original = AutocompleteResult.builder()
                    .id(123L)
                    .title("Pasta Carbonara")
                    .imageType("jpg")
                    .build();

            // Act
            String json = jsonMapper.writeValueAsString(original);
            AutocompleteResult deserialized = jsonMapper.readValue(json, AutocompleteResult.class);

            // Assert
            assertThat(deserialized.getId()).isEqualTo(123L);
            assertThat(deserialized.getTitle()).isEqualTo("Pasta Carbonara");
        }

        @Test
        @DisplayName("should ignore unknown properties in JSON")
        void shouldIgnoreUnknownProperties() throws Exception {
            // Arrange - JSON with extra unknown field
            String json = "{\"id\":123,\"title\":\"Test\",\"unknownField\":\"value\"}";

            // Act
            AutocompleteResult deserialized = jsonMapper.readValue(json, AutocompleteResult.class);

            // Assert - should not throw, should ignore unknown field
            assertThat(deserialized.getId()).isEqualTo(123L);
            assertThat(deserialized.getTitle()).isEqualTo("Test");
        }
    }

    @Nested
    @DisplayName("NutritionInfo")
    class NutritionInfoTests {

        @Test
        @DisplayName("should serialize and deserialize with nested objects")
        void shouldSerializeWithNestedObjects() throws Exception {
            // Arrange
            Nutrient nutrient1 = Nutrient.builder().name("Calories").amount(500.0).unit("kcal").build();
            Nutrient nutrient2 = Nutrient.builder().name("Protein").amount(20.0).unit("g").build();

            NutritionInfo original = NutritionInfo.builder()
                    .nutrients(Arrays.asList(nutrient1, nutrient2))
                    .build();

            // Act
            String json = jsonMapper.writeValueAsString(original);
            NutritionInfo deserialized = jsonMapper.readValue(json, NutritionInfo.class);

            // Assert
            assertThat(deserialized.getNutrients()).hasSize(2);
            assertThat(deserialized.getNutrients().get(0).getName()).isEqualTo("Calories");
            assertThat(deserialized.getNutrients().get(1).getName()).isEqualTo("Protein");
        }
    }
}
