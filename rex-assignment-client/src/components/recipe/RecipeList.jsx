import { Frown } from 'lucide-react'
import RecipeCard from './RecipeCard'

function RecipeList({ recipes, totalResults, currentPage = 1, recipesPerPage = 12 }) {
  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-interactive flex items-center justify-center">
          <Frown className="w-10 h-10 text-subtle" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-display font-bold text-default mb-2">
          No recipes found
        </h3>
        <p className="text-muted max-w-md mx-auto">
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
        <p className="text-subtle">
          Showing{' '}
          <span className="font-semibold text-default">
            {startItem}-{endItem}
          </span>
          {' '}of{' '}
          <span className="font-semibold text-default">
            {totalResults}
          </span>
          {' '}recipes
        </p>
        <p className="text-sm text-subtle">
          Page {currentPage} of {Math.ceil(totalResults / recipesPerPage)}
        </p>
      </div>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-stagger"
        role="list"
        aria-label="Recipe search results"
      >
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}

export default RecipeList
