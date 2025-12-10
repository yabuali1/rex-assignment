import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, Search } from 'lucide-react'
import SearchBar from '../components/common/SearchBar'
import FilterSelect from '../components/common/FilterSelect'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import Pagination from '../components/common/Pagination'
import RecipeList from '../components/recipe/RecipeList'
import { useRecipeSearch } from '../hooks/useRecipes'

const RECIPES_PER_PAGE = 12

const DIET_OPTIONS = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten free', label: 'Gluten Free' },
  { value: 'ketogenic', label: 'Ketogenic' },
  { value: 'paleo', label: 'Paleo' },
  { value: 'pescetarian', label: 'Pescetarian' },
]

const CUISINE_OPTIONS = [
  { value: 'african', label: 'African' },
  { value: 'american', label: 'American' },
  { value: 'british', label: 'British' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'french', label: 'French' },
  { value: 'greek', label: 'Greek' },
  { value: 'indian', label: 'Indian' },
  { value: 'italian', label: 'Italian' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'korean', label: 'Korean' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'mexican', label: 'Mexican' },
  { value: 'middle eastern', label: 'Middle Eastern' },
  { value: 'thai', label: 'Thai' },
  { value: 'vietnamese', label: 'Vietnamese' },
]

const TYPE_OPTIONS = [
  { value: 'main course', label: 'Main Course' },
  { value: 'side dish', label: 'Side Dish' },
  { value: 'dessert', label: 'Dessert' },
  { value: 'appetizer', label: 'Appetizer' },
  { value: 'salad', label: 'Salad' },
  { value: 'bread', label: 'Bread' },
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'soup', label: 'Soup' },
  { value: 'beverage', label: 'Beverage' },
  { value: 'sauce', label: 'Sauce' },
  { value: 'snack', label: 'Snack' },
]

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Initialize state from URL params
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [diet, setDiet] = useState(searchParams.get('diet') || '')
  const [cuisine, setCuisine] = useState(searchParams.get('cuisine') || '')
  const [type, setType] = useState(searchParams.get('type') || '')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1)

  const { recipes, totalResults, loading, error, hasSearched, searchRecipes } = useRecipeSearch()

  const totalPages = Math.ceil(totalResults / RECIPES_PER_PAGE)

  // Update URL params
  const updateUrlParams = (newParams) => {
    const params = new URLSearchParams()

    const q = newParams.query ?? query
    const p = newParams.page ?? currentPage
    const d = newParams.diet ?? diet
    const c = newParams.cuisine ?? cuisine
    const t = newParams.type ?? type

    if (q) params.set('q', q)
    if (p > 1) params.set('page', p.toString())
    if (d) params.set('diet', d)
    if (c) params.set('cuisine', c)
    if (t) params.set('type', t)

    setSearchParams(params, { replace: true })
  }

  const performSearch = (searchQuery, page = 1, filters = {}) => {
    const offset = (page - 1) * RECIPES_PER_PAGE
    searchRecipes({
      query: searchQuery,
      diet: filters.diet || diet || undefined,
      cuisine: filters.cuisine || cuisine || undefined,
      type: filters.type || type || undefined,
      offset,
      number: RECIPES_PER_PAGE,
    })
  }

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery)
    setCurrentPage(1)
    updateUrlParams({ query: searchQuery, page: 1 })
    performSearch(searchQuery, 1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    updateUrlParams({ page })
    performSearch(query, page)
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  const handleFilterChange = (filterName, value) => {
    const newFilters = { diet, cuisine, type, [filterName]: value }

    if (filterName === 'diet') setDiet(value)
    if (filterName === 'cuisine') setCuisine(value)
    if (filterName === 'type') setType(value)

    setCurrentPage(1)
    updateUrlParams({ [filterName]: value, page: 1 })

    if (hasSearched) {
      performSearch(query, 1, newFilters)
    }
  }

  const clearFilters = () => {
    setDiet('')
    setCuisine('')
    setType('')
    setCurrentPage(1)
    updateUrlParams({ diet: '', cuisine: '', type: '', page: 1 })

    if (hasSearched) {
      performSearch(query, 1, { diet: '', cuisine: '', type: '' })
    }
  }

  // Load search from URL on mount
  useEffect(() => {
    const urlQuery = searchParams.get('q')
    const urlPage = parseInt(searchParams.get('page')) || 1

    if (urlQuery) {
      setShowFilters(diet || cuisine || type ? true : false)
      performSearch(urlQuery, urlPage)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const hasActiveFilters = diet || cuisine || type

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-sage-50 to-accent/10 dark:from-primary/20 dark:via-sage-900 dark:to-accent/20 py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-sage-900 dark:text-sage-50 mb-6 animate-fade-in">
              Find Your Perfect{' '}
              <span className="text-primary dark:text-primary-light">Recipe</span>
            </h1>
            <p className="text-lg md:text-xl text-sage-600 dark:text-sage-300 mb-8 animate-fade-in">
              Discover delicious recipes with detailed nutritional information.
              Search by ingredients, cuisine, or dietary preferences.
            </p>

            <div className="animate-slide-up">
              <SearchBar onSearch={handleSearch} initialValue={query} />
            </div>

            {/* Filter Toggle */}
            <div className="mt-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 text-sage-600 dark:text-sage-300 hover:text-primary dark:hover:text-primary-light transition-colors"
                aria-expanded={showFilters}
                aria-controls="filter-panel"
              >
                <SlidersHorizontal
                  className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
                <span className="font-medium">
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </span>
                {hasActiveFilters && (
                  <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </button>
            </div>

            {/* Filters Panel */}
            <div
              id="filter-panel"
              className={`mt-6 overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
              <div className="card p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FilterSelect
                    label="Diet"
                    id="diet-filter"
                    value={diet}
                    onChange={(value) => handleFilterChange('diet', value)}
                    options={DIET_OPTIONS}
                    placeholder="All Diets"
                  />
                  <FilterSelect
                    label="Cuisine"
                    id="cuisine-filter"
                    value={cuisine}
                    onChange={(value) => handleFilterChange('cuisine', value)}
                    options={CUISINE_OPTIONS}
                    placeholder="All Cuisines"
                  />
                  <FilterSelect
                    label="Meal Type"
                    id="type-filter"
                    value={type}
                    onChange={(value) => handleFilterChange('type', value)}
                    options={TYPE_OPTIONS}
                    placeholder="All Types"
                  />
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-sm text-accent hover:text-accent-dark font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sage-300 dark:via-sage-700 to-transparent" aria-hidden="true" />
      </section>

      {/* Results Section */}
      <section className="py-12 md:py-16" aria-live="polite">
        <div className="container-custom">
          {loading && <LoadingSpinner message="Searching recipes..." />}

          {error && (
            <ErrorMessage
              title="Search Failed"
              message={error}
              onRetry={() => handleSearch(query)}
            />
          )}

          {!loading && !error && hasSearched && (
            <>
              <RecipeList
                recipes={recipes}
                totalResults={totalResults}
                currentPage={currentPage}
                recipesPerPage={RECIPES_PER_PAGE}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}

          {!loading && !error && !hasSearched && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <Search className="w-12 h-12 text-primary" aria-hidden="true" />
              </div>
              <h2 className="font-display text-2xl font-bold text-sage-900 dark:text-sage-50 mb-2">
                Start Your Culinary Journey
              </h2>
              <p className="text-sage-600 dark:text-sage-400 max-w-md mx-auto">
                Search for any recipe or ingredient above to discover amazing dishes with detailed nutritional information.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default HomePage
