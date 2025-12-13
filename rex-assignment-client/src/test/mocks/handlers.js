import { http, HttpResponse } from 'msw'

// Mock data
export const mockRecipes = [
  {
    id: 1,
    title: 'Pasta Carbonara',
    image: 'https://example.com/pasta.jpg',
    readyInMinutes: 30,
    servings: 4,
  },
  {
    id: 2,
    title: 'Chicken Alfredo',
    image: 'https://example.com/chicken.jpg',
    readyInMinutes: 45,
    servings: 6,
  },
  {
    id: 3,
    title: 'Vegetable Stir Fry',
    image: 'https://example.com/stirfry.jpg',
    readyInMinutes: 20,
    servings: 2,
  },
]

export const mockRecipeDetail = {
  id: 1,
  title: 'Pasta Carbonara',
  image: 'https://example.com/pasta.jpg',
  readyInMinutes: 30,
  servings: 4,
  summary: 'A classic Italian pasta dish with eggs, cheese, and pancetta.',
  instructions: 'Cook pasta, make sauce, combine.',
  healthScore: 65,
  vegetarian: false,
  vegan: false,
  glutenFree: false,
  dairyFree: false,
  extendedIngredients: [
    { id: 1, name: 'pasta', original: '400g spaghetti', amount: 400, unit: 'g' },
    { id: 2, name: 'eggs', original: '4 large eggs', amount: 4, unit: '' },
    { id: 3, name: 'parmesan', original: '100g parmesan cheese', amount: 100, unit: 'g' },
  ],
  nutrition: {
    nutrients: [
      { name: 'Calories', amount: 550, unit: 'kcal', percentOfDailyNeeds: 27.5 },
      { name: 'Protein', amount: 25, unit: 'g', percentOfDailyNeeds: 50 },
      { name: 'Carbohydrates', amount: 65, unit: 'g', percentOfDailyNeeds: 21.7 },
      { name: 'Fat', amount: 18, unit: 'g', percentOfDailyNeeds: 27.7 },
    ],
    // Per-ingredient nutrition data (used for client-side exclusion calculations)
    ingredients: [
      {
        id: 1,
        name: 'pasta',
        amount: 400,
        unit: 'g',
        nutrients: [
          { name: 'Calories', amount: 350, unit: 'kcal' },
          { name: 'Protein', amount: 12, unit: 'g' },
          { name: 'Carbohydrates', amount: 60, unit: 'g' },
          { name: 'Fat', amount: 2, unit: 'g' },
        ],
      },
      {
        id: 2,
        name: 'eggs',
        amount: 4,
        unit: '',
        nutrients: [
          { name: 'Calories', amount: 100, unit: 'kcal' },
          { name: 'Protein', amount: 8, unit: 'g' },
          { name: 'Carbohydrates', amount: 1, unit: 'g' },
          { name: 'Fat', amount: 8, unit: 'g' },
        ],
      },
      {
        id: 3,
        name: 'parmesan',
        amount: 100,
        unit: 'g',
        nutrients: [
          { name: 'Calories', amount: 100, unit: 'kcal' },
          { name: 'Protein', amount: 5, unit: 'g' },
          { name: 'Carbohydrates', amount: 4, unit: 'g' },
          { name: 'Fat', amount: 8, unit: 'g' },
        ],
      },
    ],
  },
  dishTypes: ['main course', 'dinner'],
  cuisines: ['Italian'],
  diets: [],
}

export const mockAutocompleteSuggestions = [
  { id: 1, title: 'Pasta Carbonara' },
  { id: 2, title: 'Pasta Primavera' },
  { id: 3, title: 'Pasta Bolognese' },
]

// MSW Handlers - Use wildcard (*) to match any origin
export const handlers = [
  // Health check
  http.get('*/api/recipes/health', () => {
    return new HttpResponse('Recipe API is running', {
      headers: { 'Content-Type': 'text/plain' },
    })
  }),

  // Search recipes
  http.get('*/api/recipes/search', ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('query') || ''
    const offset = parseInt(url.searchParams.get('offset') || '0')
    const number = parseInt(url.searchParams.get('number') || '12')

    // Filter recipes based on query
    const filteredRecipes = query
      ? mockRecipes.filter(r =>
        r.title.toLowerCase().includes(query.toLowerCase())
      )
      : mockRecipes

    return HttpResponse.json({
      results: filteredRecipes.slice(offset, offset + number),
      offset,
      number,
      totalResults: filteredRecipes.length,
    })
  }),

  // Autocomplete suggestions
  http.get('*/api/recipes/autocomplete', ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('query') || ''
    const number = parseInt(url.searchParams.get('number') || '5')

    if (query.length < 2) {
      return HttpResponse.json([])
    }

    const filtered = mockAutocompleteSuggestions
      .filter(s => s.title.toLowerCase().includes(query.toLowerCase()))
      .slice(0, number)

    return HttpResponse.json(filtered)
  }),

  // Get recipe by ID - Use regex to match /api/recipes/:id (but not other paths)
  http.get(/\/api\/recipes\/(\d+)$/, ({ params }) => {
    // Extract the ID from the URL
    const url = params[0] || '1'
    const id = parseInt(url)

    if (id === 999) {
      return HttpResponse.json(
        { message: 'Recipe not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json({
      ...mockRecipeDetail,
      id,
    })
  }),
]
