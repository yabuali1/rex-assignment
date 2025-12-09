import { describe, it, expect } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useRecipeSearch, useRecipeDetail } from './useRecipes'

describe('useRecipeSearch', () => {
  describe('initial state', () => {
    it('has empty recipes array', () => {
      const { result } = renderHook(() => useRecipeSearch())
      
      expect(result.current.recipes).toEqual([])
    })

    it('has zero total results', () => {
      const { result } = renderHook(() => useRecipeSearch())
      
      expect(result.current.totalResults).toBe(0)
    })

    it('is not loading initially', () => {
      const { result } = renderHook(() => useRecipeSearch())
      
      expect(result.current.loading).toBe(false)
    })

    it('has no error initially', () => {
      const { result } = renderHook(() => useRecipeSearch())
      
      expect(result.current.error).toBeNull()
    })

    it('has not searched initially', () => {
      const { result } = renderHook(() => useRecipeSearch())
      
      expect(result.current.hasSearched).toBe(false)
    })
  })

  describe('searchRecipes', () => {
    it('sets loading to true during search', async () => {
      const { result } = renderHook(() => useRecipeSearch())
      
      act(() => {
        result.current.searchRecipes({ query: 'pasta' })
      })
      
      expect(result.current.loading).toBe(true)
    })

    it('fetches and returns recipes', async () => {
      const { result } = renderHook(() => useRecipeSearch())
      
      await act(async () => {
        await result.current.searchRecipes({ query: 'pasta' })
      })
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.recipes.length).toBeGreaterThan(0)
      })
    })

    it('sets hasSearched to true after search', async () => {
      const { result } = renderHook(() => useRecipeSearch())
      
      await act(async () => {
        await result.current.searchRecipes({ query: 'pasta' })
      })
      
      expect(result.current.hasSearched).toBe(true)
    })

    it('updates totalResults', async () => {
      const { result } = renderHook(() => useRecipeSearch())
      
      await act(async () => {
        await result.current.searchRecipes({ query: '' })
      })
      
      await waitFor(() => {
        expect(result.current.totalResults).toBeGreaterThan(0)
      })
    })
  })

  describe('clearSearch', () => {
    it('resets recipes to empty array', async () => {
      const { result } = renderHook(() => useRecipeSearch())
      
      // First search
      await act(async () => {
        await result.current.searchRecipes({ query: 'pasta' })
      })
      
      // Then clear
      act(() => {
        result.current.clearSearch()
      })
      
      expect(result.current.recipes).toEqual([])
    })

    it('resets totalResults to zero', async () => {
      const { result } = renderHook(() => useRecipeSearch())
      
      await act(async () => {
        await result.current.searchRecipes({ query: 'pasta' })
      })
      
      act(() => {
        result.current.clearSearch()
      })
      
      expect(result.current.totalResults).toBe(0)
    })

    it('resets hasSearched to false', async () => {
      const { result } = renderHook(() => useRecipeSearch())
      
      await act(async () => {
        await result.current.searchRecipes({ query: 'pasta' })
      })
      
      act(() => {
        result.current.clearSearch()
      })
      
      expect(result.current.hasSearched).toBe(false)
    })

    it('clears any errors', async () => {
      const { result } = renderHook(() => useRecipeSearch())
      
      act(() => {
        result.current.clearSearch()
      })
      
      expect(result.current.error).toBeNull()
    })
  })
})

describe('useRecipeDetail', () => {
  describe('initial state', () => {
    it('has null recipe', () => {
      const { result } = renderHook(() => useRecipeDetail())
      
      expect(result.current.recipe).toBeNull()
    })

    it('is not loading initially', () => {
      const { result } = renderHook(() => useRecipeDetail())
      
      expect(result.current.loading).toBe(false)
    })

    it('has no error initially', () => {
      const { result } = renderHook(() => useRecipeDetail())
      
      expect(result.current.error).toBeNull()
    })
  })

  describe('fetchRecipe', () => {
    it('sets loading to true during fetch', async () => {
      const { result } = renderHook(() => useRecipeDetail())
      
      act(() => {
        result.current.fetchRecipe(1)
      })
      
      expect(result.current.loading).toBe(true)
    })

    it('fetches recipe by id', async () => {
      const { result } = renderHook(() => useRecipeDetail())
      
      await act(async () => {
        await result.current.fetchRecipe(1)
      })
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.recipe).not.toBeNull()
        expect(result.current.recipe.id).toBe(1)
      })
    })

    it('handles not found error', async () => {
      const { result } = renderHook(() => useRecipeDetail())
      
      await act(async () => {
        await result.current.fetchRecipe(999)
      })
      
      await waitFor(() => {
        expect(result.current.error).toBeTruthy()
        expect(result.current.recipe).toBeNull()
      })
    })
  })

  describe('fetchWithExclusions', () => {
    it('fetches recipe with excluded ingredients', async () => {
      const { result } = renderHook(() => useRecipeDetail())
      
      await act(async () => {
        await result.current.fetchWithExclusions(1, ['pasta'])
      })
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.recipe).not.toBeNull()
      })
    })

    it('reduces nutrition when ingredients excluded', async () => {
      const { result } = renderHook(() => useRecipeDetail())
      
      // First fetch without exclusions
      await act(async () => {
        await result.current.fetchRecipe(1)
      })
      
      const originalCalories = result.current.recipe.nutrition.nutrients[0].amount
      
      // Then fetch with exclusions
      await act(async () => {
        await result.current.fetchWithExclusions(1, ['pasta'])
      })
      
      await waitFor(() => {
        const newCalories = result.current.recipe.nutrition.nutrients[0].amount
        expect(newCalories).toBeLessThan(originalCalories)
      })
    })
  })
})

