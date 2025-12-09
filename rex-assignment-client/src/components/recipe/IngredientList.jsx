import { X } from 'lucide-react'

function IngredientList({ ingredients, excludedIngredients, onToggleExclude }) {
  if (!ingredients || ingredients.length === 0) {
    return null
  }

  const isExcluded = (ingredient) => {
    return excludedIngredients.some(
      ex => ingredient.name?.toLowerCase().includes(ex.toLowerCase())
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl font-bold text-sage-900 dark:text-sage-50">
          Ingredients
        </h2>
        <span className="badge">
          {ingredients.length} items
        </span>
      </div>

      <p className="text-sm text-sage-600 dark:text-sage-400 mb-4">
        Click on an ingredient to exclude it and see updated nutrition info.
      </p>

      <ul className="space-y-2" role="list" aria-label="Recipe ingredients">
        {ingredients.map((ingredient, index) => {
          const excluded = isExcluded(ingredient)

          return (
            <li key={ingredient.id || index}>
              <button
                onClick={() => onToggleExclude(ingredient.name)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 group ${excluded
                    ? 'bg-gray-50 dark:bg-gray-900/20 border-2 border-gray-200 dark:border-gray-800'
                    : 'bg-sage-50 dark:bg-sage-800/50 border-2 border-transparent hover:border-primary/30'
                  }`}
                aria-pressed={excluded}
                aria-label={`${excluded ? 'Include' : 'Exclude'} ${ingredient.name}`}
              >
                <span
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${excluded
                      ? 'bg-gray-500 border-gray-500'
                      : 'border-sage-300 dark:border-sage-600 group-hover:border-primary'
                    }`}
                  aria-hidden="true"
                >
                  {excluded && (
                    <X className="w-3 h-3 text-white" strokeWidth={3} />
                  )}
                </span>

                <span className={`flex-grow ${excluded ? 'line-through text-sage-400 dark:text-sage-500' : 'text-sage-700 dark:text-sage-300'}`}>
                  {ingredient.original || `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`}
                </span>

                {excluded && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Excluded
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default IngredientList
