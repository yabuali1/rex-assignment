import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, Clock, Users, Heart, ImageOff, ExternalLink } from 'lucide-react'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import IngredientList from '../components/recipe/IngredientList'
import NutritionPanel from '../components/recipe/NutritionPanel'
import { useRecipeDetail } from '../hooks/useRecipes'

function RecipeDetailPage() {
  const { id } = useParams()
  const { recipe, loading, error, fetchRecipe, fetchWithExclusions } = useRecipeDetail()
  const [excludedIngredients, setExcludedIngredients] = useState([])

  useEffect(() => {
    if (id) {
      fetchRecipe(id)
      setExcludedIngredients([])
    }
  }, [id, fetchRecipe])

  const handleToggleExclude = useCallback((ingredientName) => {
    setExcludedIngredients(prev => {
      const isCurrentlyExcluded = prev.some(
        ex => ingredientName.toLowerCase().includes(ex.toLowerCase()) ||
          ex.toLowerCase().includes(ingredientName.toLowerCase())
      )

      let newExcluded
      if (isCurrentlyExcluded) {
        newExcluded = prev.filter(
          ex => !ingredientName.toLowerCase().includes(ex.toLowerCase()) &&
            !ex.toLowerCase().includes(ingredientName.toLowerCase())
        )
      } else {
        newExcluded = [...prev, ingredientName]
      }

      // Fetch updated nutrition
      if (newExcluded.length > 0) {
        fetchWithExclusions(id, newExcluded)
      } else {
        fetchRecipe(id)
      }

      return newExcluded
    })
  }, [id, fetchRecipe, fetchWithExclusions])

  if (loading && !recipe) {
    return (
      <div className="container-custom py-16">
        <LoadingSpinner message="Loading recipe details..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-custom py-16">
        <ErrorMessage
          title="Recipe Not Found"
          message={error}
          onRetry={() => fetchRecipe(id)}
        />
      </div>
    )
  }

  if (!recipe) {
    return null
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Back Navigation */}
      <div className="bg-muted border-b border-default">
        <div className="container-custom py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted hover:text-primary dark:hover:text-primary-light transition-colors"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            <span className="font-medium">Back to Search</span>
          </Link>
        </div>
      </div>

      {/* Recipe Header */}
      <section className="relative">
        <div className="aspect-[21/9] md:aspect-[3/1] overflow-hidden bg-muted">
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff className="w-24 h-24 text-subtle" aria-hidden="true" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
        </div>

        <div className="container-custom">
          <div className="relative -mt-24 md:-mt-32 mb-8">
            <div className="card p-6 md:p-8">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-default mb-4">
                {recipe.title}
              </h1>

              {/* Recipe Meta */}
              <div className="flex flex-wrap gap-3 mb-6">
                {recipe.readyInMinutes && (
                  <div className="badge">
                    <Clock className="w-4 h-4 mr-1" aria-hidden="true" />
                    {recipe.readyInMinutes} mins
                  </div>
                )}
                {recipe.servings && (
                  <div className="badge">
                    <Users className="w-4 h-4 mr-1" aria-hidden="true" />
                    {recipe.servings} servings
                  </div>
                )}
                {recipe.healthScore > 0 && (
                  <div className="badge-accent">
                    <Heart className="w-4 h-4 mr-1" aria-hidden="true" />
                    Health Score: {recipe.healthScore}/100
                  </div>
                )}
              </div>

              {/* Diet Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {recipe.vegetarian && (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    Vegetarian
                  </span>
                )}
                {recipe.vegan && (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    Vegan
                  </span>
                )}
                {recipe.glutenFree && (
                  <span className="text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                    Gluten Free
                  </span>
                )}
                {recipe.dairyFree && (
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    Dairy Free
                  </span>
                )}
                {recipe.veryHealthy && (
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                    Very Healthy
                  </span>
                )}
              </div>

              {/* Cuisines and Dish Types */}
              {(recipe.cuisines?.length > 0 || recipe.dishTypes?.length > 0) && (
                <div className="flex flex-wrap gap-2 text-sm text-subtle">
                  {recipe.cuisines?.map((cuisine, i) => (
                    <span key={i}>#{cuisine}</span>
                  ))}
                  {recipe.dishTypes?.map((type, i) => (
                    <span key={i}>#{type}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Content */}
      <section className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingredients Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <IngredientList
                ingredients={recipe.extendedIngredients}
                excludedIngredients={excludedIngredients}
                onToggleExclude={handleToggleExclude}
              />
            </div>
          </div>

          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Nutrition */}
            <NutritionPanel
              nutrition={recipe.nutrition}
              hasExclusions={excludedIngredients.length > 0}
            />

            {/* Summary */}
            {recipe.summary && (
              <div>
                <h2 className="font-display text-2xl font-bold text-default mb-4">
                  About This Recipe
                </h2>
                <div
                  className="prose prose-sage dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: recipe.summary }}
                />
              </div>
            )}

            {/* Instructions */}
            {recipe.instructions && (
              <div>
                <h2 className="font-display text-2xl font-bold text-default mb-4">
                  Instructions
                </h2>
                <div
                  className="prose prose-sage dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                />
              </div>
            )}

            {/* Source Link */}
            {recipe.sourceUrl && (
              <div className="pt-6 border-t border-default">
                <a
                  href={recipe.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary font-medium"
                >
                  <span>View Original Recipe</span>
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Loading overlay for exclusion updates */}
      {loading && recipe && (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/40 flex items-center justify-center z-50" role="status">
          <div className="bg-surface rounded-xl p-6 shadow-xl">
            <LoadingSpinner size="small" message="Updating nutrition..." />
          </div>
        </div>
      )}
    </div>
  )
}

export default RecipeDetailPage
