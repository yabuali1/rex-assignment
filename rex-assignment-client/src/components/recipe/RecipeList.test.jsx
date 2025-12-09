import { describe, it, expect } from 'vitest'
import { render, screen } from '../../test/test-utils'
import RecipeList from './RecipeList'

describe('RecipeList', () => {
  const mockRecipes = [
    { id: 1, title: 'Pasta Carbonara', image: 'https://example.com/pasta.jpg' },
    { id: 2, title: 'Chicken Alfredo', image: 'https://example.com/chicken.jpg' },
    { id: 3, title: 'Vegetable Stir Fry', image: 'https://example.com/stirfry.jpg' },
  ]

  describe('when recipes are provided', () => {
    it('renders all recipes', () => {
      render(<RecipeList recipes={mockRecipes} totalResults={3} />)
      
      expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument()
      expect(screen.getByText('Chicken Alfredo')).toBeInTheDocument()
      expect(screen.getByText('Vegetable Stir Fry')).toBeInTheDocument()
    })

    it('displays correct result count', () => {
      render(<RecipeList recipes={mockRecipes} totalResults={3} currentPage={1} recipesPerPage={12} />)
      
      // The component shows "Showing X-Y of Z recipes"
      expect(screen.getByText(/Showing/)).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument() // totalResults
    })

    it('displays correct page info', () => {
      render(<RecipeList recipes={mockRecipes} totalResults={100} currentPage={2} recipesPerPage={12} />)
      
      // Page 2 of ceil(100/12) = 9 pages
      expect(screen.getByText(/Page 2 of/)).toBeInTheDocument()
    })

    it('has accessible list role', () => {
      render(<RecipeList recipes={mockRecipes} totalResults={3} />)
      
      const list = screen.getByRole('list', { name: /recipe search results/i })
      expect(list).toBeInTheDocument()
    })
  })

  describe('when no recipes are provided', () => {
    it('shows empty state message', () => {
      render(<RecipeList recipes={[]} totalResults={0} />)
      
      expect(screen.getByText('No recipes found')).toBeInTheDocument()
    })

    it('shows helpful suggestion text', () => {
      render(<RecipeList recipes={[]} totalResults={0} />)
      
      expect(screen.getByText(/try adjusting your search/i)).toBeInTheDocument()
    })

    it('shows empty state when recipes is null', () => {
      render(<RecipeList recipes={null} totalResults={0} />)
      
      expect(screen.getByText('No recipes found')).toBeInTheDocument()
    })
  })

  describe('pagination display', () => {
    it('shows Showing text with recipe count', () => {
      render(<RecipeList recipes={mockRecipes} totalResults={50} currentPage={1} recipesPerPage={12} />)
      
      // Should show "Showing X-Y of 50 recipes"
      expect(screen.getByText(/Showing/)).toBeInTheDocument()
      expect(screen.getByText('50')).toBeInTheDocument()
    })

    it('shows page info for middle page', () => {
      const recipes12 = Array(12).fill(null).map((_, i) => ({
        id: i + 1,
        title: `Recipe ${i + 1}`,
        image: `https://example.com/${i}.jpg`,
      }))
      
      render(<RecipeList recipes={recipes12} totalResults={50} currentPage={2} recipesPerPage={12} />)
      
      expect(screen.getByText(/Page 2 of/)).toBeInTheDocument()
    })
  })
})
