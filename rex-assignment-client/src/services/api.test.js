import { describe, it, expect } from 'vitest'
import { recipeApi } from './api'
import { server } from '../test/mocks/server'
import { http, HttpResponse } from 'msw'

describe('recipeApi', () => {
  describe('searchRecipes', () => {
    it('returns recipes matching query', async () => {
      const result = await recipeApi.searchRecipes({ query: 'Pasta' })
      
      expect(result.results).toBeDefined()
      expect(result.totalResults).toBeGreaterThan(0)
    })

    it('returns all recipes when query is empty', async () => {
      const result = await recipeApi.searchRecipes({ query: '' })
      
      expect(result.results.length).toBeGreaterThan(0)
    })

    it('includes offset and number in response', async () => {
      const result = await recipeApi.searchRecipes({ 
        query: '', 
        offset: 10, 
        number: 5 
      })
      
      expect(result.offset).toBe(10)
      expect(result.number).toBe(5)
    })

    it('filters by diet when provided', async () => {
      // Override handler to check diet parameter
      server.use(
        http.get('/api/recipes/search', ({ request }) => {
          const url = new URL(request.url)
          const diet = url.searchParams.get('diet')
          
          return HttpResponse.json({
            results: diet === 'vegetarian' ? [{ id: 1, title: 'Veggie Bowl' }] : [],
            offset: 0,
            number: 12,
            totalResults: diet === 'vegetarian' ? 1 : 0,
          })
        })
      )

      const result = await recipeApi.searchRecipes({ query: '', diet: 'vegetarian' })
      
      expect(result.totalResults).toBe(1)
      expect(result.results[0].title).toBe('Veggie Bowl')
    })

    it('handles API errors', async () => {
      server.use(
        http.get('/api/recipes/search', () => {
          return HttpResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
          )
        })
      )

      await expect(recipeApi.searchRecipes({ query: 'test' }))
        .rejects.toThrow()
    })
  })

  describe('getRecipeById', () => {
    it('returns recipe details', async () => {
      const result = await recipeApi.getRecipeById(1)
      
      expect(result.id).toBe(1)
      expect(result.title).toBeDefined()
      expect(result.extendedIngredients).toBeDefined()
      expect(result.nutrition).toBeDefined()
    })

    it('includes nutrition information', async () => {
      const result = await recipeApi.getRecipeById(1)
      
      expect(result.nutrition.nutrients).toBeDefined()
      expect(result.nutrition.nutrients.length).toBeGreaterThan(0)
    })

    it('throws error for non-existent recipe', async () => {
      await expect(recipeApi.getRecipeById(999))
        .rejects.toThrow()
    })
  })

  describe('getRecipeWithExclusions', () => {
    it('returns recipe with modified nutrition', async () => {
      const result = await recipeApi.getRecipeWithExclusions(1, ['pasta'])
      
      expect(result.id).toBe(1)
      expect(result.nutrition).toBeDefined()
    })

    it('reduces nutrition values when ingredients excluded', async () => {
      const original = await recipeApi.getRecipeById(1)
      const withExclusions = await recipeApi.getRecipeWithExclusions(1, ['pasta'])
      
      const originalCalories = original.nutrition.nutrients[0].amount
      const reducedCalories = withExclusions.nutrition.nutrients[0].amount
      
      expect(reducedCalories).toBeLessThan(originalCalories)
    })

    it('works with empty exclusion list', async () => {
      const result = await recipeApi.getRecipeWithExclusions(1, [])
      
      expect(result.id).toBe(1)
    })
  })

  describe('getAutocompleteSuggestions', () => {
    it('returns suggestions for valid query', async () => {
      const result = await recipeApi.getAutocompleteSuggestions('pasta', 5)
      
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })

    it('returns empty array for short query', async () => {
      const result = await recipeApi.getAutocompleteSuggestions('p', 5)
      
      expect(result).toEqual([])
    })

    it('returns empty array for empty query', async () => {
      const result = await recipeApi.getAutocompleteSuggestions('', 5)
      
      expect(result).toEqual([])
    })

    it('returns empty array for null query', async () => {
      const result = await recipeApi.getAutocompleteSuggestions(null, 5)
      
      expect(result).toEqual([])
    })

    it('limits results to specified number', async () => {
      const result = await recipeApi.getAutocompleteSuggestions('pasta', 2)
      
      expect(result.length).toBeLessThanOrEqual(2)
    })

    it('returns suggestions with id and title', async () => {
      const result = await recipeApi.getAutocompleteSuggestions('pasta', 5)
      
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('id')
        expect(result[0]).toHaveProperty('title')
      }
    })
  })

  describe('healthCheck', () => {
    it('returns health status', async () => {
      const result = await recipeApi.healthCheck()
      
      expect(result).toBe('Recipe API is running')
    })
  })
})

