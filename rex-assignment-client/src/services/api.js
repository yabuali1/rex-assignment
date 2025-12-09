import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred'
    console.error('API Error:', message)
    return Promise.reject(error)
  }
)

export const recipeApi = {
  /**
   * Search for recipes with optional filters
   */
  searchRecipes: async ({ query = '', diet, cuisine, type, offset = 0, number = 12 }) => {
    const params = new URLSearchParams()
    params.append('query', query)
    params.append('offset', offset.toString())
    params.append('number', number.toString())

    if (diet) params.append('diet', diet)
    if (cuisine) params.append('cuisine', cuisine)
    if (type) params.append('type', type)

    const response = await api.get(`/recipes/search?${params.toString()}`)
    return response.data
  },

  /**
   * Get detailed recipe information by ID
   */
  getRecipeById: async (id) => {
    const response = await api.get(`/recipes/${id}`)
    return response.data
  },

  /**
   * Get recipe with excluded ingredients
   */
  getRecipeWithExclusions: async (id, excludedIngredients = []) => {
    const params = new URLSearchParams()
    excludedIngredients.forEach(ing => params.append('excludeIngredients', ing))

    const response = await api.get(`/recipes/${id}/exclude?${params.toString()}`)
    return response.data
  },

  /**
   * Get autocomplete suggestions
   */
  getAutocompleteSuggestions: async (query, number = 5) => {
    if (!query || query.trim().length < 2) return []

    const response = await api.get(`/recipes/autocomplete?query=${encodeURIComponent(query)}&number=${number}`)
    return response.data
  },

  /**
   * Health check
   */
  healthCheck: async () => {
    const response = await api.get('/recipes/health')
    return response.data
  },
}

export default api

