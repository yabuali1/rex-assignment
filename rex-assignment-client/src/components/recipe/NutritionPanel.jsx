function NutritionPanel({ nutrition, hasExclusions }) {
  if (!nutrition) {
    return null
  }

  // Helper to find nutrient by name from the nutrients array
  const findNutrient = (name) => {
    return nutrition.nutrients?.find(n =>
      n.name.toLowerCase() === name.toLowerCase()
    )
  }

  // Get main nutrients from the nutrients array
  const calories = findNutrient('Calories')
  const protein = findNutrient('Protein')
  const carbs = findNutrient('Carbohydrates')
  const fat = findNutrient('Fat')

  const mainNutrients = [
    { name: 'Calories', value: calories?.amount || 0, unit: 'kcal', color: 'bg-amber-500' },
    { name: 'Protein', value: protein?.amount || 0, unit: 'g', color: 'bg-blue-500' },
    { name: 'Carbs', value: carbs?.amount || 0, unit: 'g', color: 'bg-green-500' },
    { name: 'Fat', value: fat?.amount || 0, unit: 'g', color: 'bg-red-500' },
  ]

  // Get other detailed nutrients (excluding the main ones we already show)
  const mainNames = ['calories', 'protein', 'carbohydrates', 'fat']
  const detailedNutrients = nutrition.nutrients
    ?.filter(n => !mainNames.includes(n.name.toLowerCase()))
    .slice(0, 10) || []

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl font-bold text-sage-900 dark:text-sage-50">
          Nutrition Facts
        </h2>
        {hasExclusions && (
          <span className="badge-accent text-xs animate-pulse">
            Updated (ingredients excluded)
          </span>
        )}
      </div>

      {/* Main nutrients grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {mainNutrients.map((nutrient) => (
          <div
            key={nutrient.name}
            className={`card p-4 text-center transition-all duration-300 ${hasExclusions ? 'ring-2 ring-accent/50' : ''
              }`}
          >
            <div className={`w-3 h-3 rounded-full ${nutrient.color} mx-auto mb-2`} aria-hidden="true" />
            <p className="text-2xl font-bold text-sage-900 dark:text-sage-50">
              {Math.round(nutrient.value)}
            </p>
            <p className="text-sm text-sage-500 dark:text-sage-400">
              {nutrient.name}
              <span className="text-xs ml-1">{nutrient.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Detailed nutrients */}
      {detailedNutrients.length > 0 && (
        <div className="card p-4">
          <h3 className="font-semibold text-sage-900 dark:text-sage-50 mb-4">
            Detailed Breakdown
          </h3>
          <div className="space-y-3">
            {detailedNutrients.map((nutrient, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sage-600 dark:text-sage-400 text-sm">
                  {nutrient.name}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-sage-100 dark:bg-sage-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(nutrient.percentOfDailyNeeds || 0, 100)}%` }}
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-sm font-medium text-sage-900 dark:text-sage-100 min-w-[80px] text-right">
                    {Math.round(nutrient.amount)} {nutrient.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default NutritionPanel
