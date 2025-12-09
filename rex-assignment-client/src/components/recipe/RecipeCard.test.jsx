import { describe, it, expect } from 'vitest'
import { render, screen } from '../../test/test-utils'
import RecipeCard from './RecipeCard'

describe('RecipeCard', () => {
    const mockRecipe = {
        id: 1,
        title: 'Pasta Carbonara',
        image: 'https://example.com/pasta.jpg',
    }

    it('renders recipe title', () => {
        render(<RecipeCard recipe={mockRecipe} />)

        expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument()
    })

    it('renders recipe image when provided', () => {
        render(<RecipeCard recipe={mockRecipe} />)

        const image = screen.getByRole('img')
        expect(image).toHaveAttribute('src', mockRecipe.image)
    })

    it('renders placeholder when image is not provided', () => {
        const recipeWithoutImage = { ...mockRecipe, image: null }
        render(<RecipeCard recipe={recipeWithoutImage} />)

        // Should not have an img element
        expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })

    it('links to recipe detail page', () => {
        render(<RecipeCard recipe={mockRecipe} />)

        const link = screen.getByRole('link', { name: /view recipe: pasta carbonara/i })
        expect(link).toHaveAttribute('href', '/recipe/1')
    })

    it('shows "View Recipe" text', () => {
        render(<RecipeCard recipe={mockRecipe} />)

        expect(screen.getByText('View Recipe')).toBeInTheDocument()
    })

    it('has proper accessibility attributes', () => {
        render(<RecipeCard recipe={mockRecipe} />)

        const listItem = screen.getByRole('listitem')
        expect(listItem).toBeInTheDocument()

        const link = screen.getByRole('link')
        expect(link).toHaveAttribute('aria-label', 'View recipe: Pasta Carbonara')
    })
})

