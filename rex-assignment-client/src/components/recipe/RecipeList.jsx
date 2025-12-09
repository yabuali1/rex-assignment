import RecipeCard from './RecipeCard'

function RecipeList({ recipes, totalResults, currentPage = 1, recipesPerPage = 12 }) {
  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-sage-100 dark:bg-sage-800 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-sage-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-display font-bold text-sage-900 dark:text-sage-50 mb-2">
          No recipes found
        </h3>
        <p className="text-sage-600 dark:text-sage-400 max-w-md mx-auto">
          Try adjusting your search terms or filters to find what you&apos;re looking for.
        </p>
      </div>
    )
  }

  // Calculate display range
  const startItem = (currentPage - 1) * recipesPerPage + 1
  const endItem = Math.min(currentPage * recipesPerPage, totalResults)

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
        <p className="text-sage-600 dark:text-sage-400">
          Showing{' '}
          <span className="font-semibold text-sage-900 dark:text-sage-100">
            {startItem}-{endItem}
          </span>
          {' '}of{' '}
          <span className="font-semibold text-sage-900 dark:text-sage-100">
            {totalResults}
          </span>
          {' '}recipes
        </p>
        <p className="text-sm text-sage-500 dark:text-sage-400">
          Page {currentPage} of {Math.ceil(totalResults / recipesPerPage)}
        </p>
      </div>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-stagger"
        role="list"
        aria-label="Recipe search results"
      >
        {recipes.map((recipe) => (
          <RecipeCard recipe={recipe} />
        ))}
      </div>
    </div>
  )
}

export default RecipeList
