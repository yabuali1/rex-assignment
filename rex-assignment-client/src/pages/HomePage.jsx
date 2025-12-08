import { useState, useEffect } from 'react'
import SearchBar from '../components/common/SearchBar'
import FilterSelect from '../components/common/FilterSelect'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import RecipeList from '../components/recipe/RecipeList'
import { useRecipeSearch } from '../hooks/useRecipes'

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
  const [query, setQuery] = useState('')
  const [diet, setDiet] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [type, setType] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const { recipes, totalResults, loading, error, hasSearched, searchRecipes } = useRecipeSearch()

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery)
    searchRecipes({
      query: searchQuery,
      diet: diet || undefined,
      cuisine: cuisine || undefined,
      type: type || undefined,
    })
  }

  // Re-search when filters change (if user has already searched)
  useEffect(() => {
    if (hasSearched) {
      searchRecipes({
        query,
        diet: diet || undefined,
        cuisine: cuisine || undefined,
        type: type || undefined,
      })
    }
  }, [diet, cuisine, type]) // eslint-disable-line react-hooks/exhaustive-deps

  const clearFilters = () => {
    setDiet('')
    setCuisine('')
    setType('')
  }

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
                <svg
                  className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
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
              className={`mt-6 overflow-hidden transition-all duration-300 ${
                showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="card p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FilterSelect
                    label="Diet"
                    id="diet-filter"
                    value={diet}
                    onChange={setDiet}
                    options={DIET_OPTIONS}
                    placeholder="All Diets"
                  />
                  <FilterSelect
                    label="Cuisine"
                    id="cuisine-filter"
                    value={cuisine}
                    onChange={setCuisine}
                    options={CUISINE_OPTIONS}
                    placeholder="All Cuisines"
                  />
                  <FilterSelect
                    label="Meal Type"
                    id="type-filter"
                    value={type}
                    onChange={setType}
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
            <RecipeList recipes={recipes} totalResults={totalResults} />
          )}

          {!loading && !error && !hasSearched && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
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

