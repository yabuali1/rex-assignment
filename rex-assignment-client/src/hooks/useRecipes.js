import { useState, useCallback } from 'react'
import { recipeApi } from '../services/api'

export function useRecipeSearch() {
  const [recipes, setRecipes] = useState([])
  const [totalResults, setTotalResults] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  const searchRecipes = useCallback(async (params) => {
    setLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const data = await recipeApi.searchRecipes(params)
      setRecipes(data.results || [])
      setTotalResults(data.totalResults || 0)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search recipes. Please try again.')
      setRecipes([])
      setTotalResults(0)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearSearch = useCallback(() => {
    setRecipes([])
    setTotalResults(0)
    setError(null)
    setHasSearched(false)
  }, [])

  return {
    recipes,
    totalResults,
    loading,
    error,
    hasSearched,
    searchRecipes,
    clearSearch,
  }
}

export function useRecipeDetail() {
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchRecipe = useCallback(async (id) => {
    setLoading(true)
    setError(null)

    try {
      const data = await recipeApi.getRecipeById(id)
      setRecipe(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load recipe details.')
      setRecipe(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchWithExclusions = useCallback(async (id, excludedIngredients) => {
    setLoading(true)
    setError(null)

    try {
      const data = await recipeApi.getRecipeWithExclusions(id, excludedIngredients)
      setRecipe(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update recipe.')
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    recipe,
    loading,
    error,
    fetchRecipe,
    fetchWithExclusions,
  }
}

