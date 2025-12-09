import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../../test/test-utils'
import userEvent from '@testing-library/user-event'
import Pagination from './Pagination'

describe('Pagination', () => {
  const mockOnPageChange = vi.fn()

  beforeEach(() => {
    mockOnPageChange.mockClear()
  })

  describe('rendering', () => {
    it('renders nothing when totalPages is 1', () => {
      const { container } = render(
        <Pagination currentPage={1} totalPages={1} onPageChange={mockOnPageChange} />
      )
      
      expect(container).toBeEmptyDOMElement()
    })

    it('renders nothing when totalPages is 0', () => {
      const { container } = render(
        <Pagination currentPage={1} totalPages={0} onPageChange={mockOnPageChange} />
      )
      
      expect(container).toBeEmptyDOMElement()
    })

    it('renders pagination when totalPages > 1', () => {
      render(
        <Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />
      )
      
      expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument()
    })

    it('renders previous and next buttons', () => {
      render(
        <Pagination currentPage={2} totalPages={5} onPageChange={mockOnPageChange} />
      )
      
      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
    })
  })

  describe('button states', () => {
    it('disables previous button on first page', () => {
      render(
        <Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />
      )
      
      expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()
    })

    it('disables next button on last page', () => {
      render(
        <Pagination currentPage={5} totalPages={5} onPageChange={mockOnPageChange} />
      )
      
      expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
    })

    it('enables both buttons on middle page', () => {
      render(
        <Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />
      )
      
      expect(screen.getByRole('button', { name: /previous/i })).not.toBeDisabled()
      expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled()
    })
  })

  describe('navigation', () => {
    it('calls onPageChange with previous page when clicking previous', async () => {
      const user = userEvent.setup()
      render(
        <Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />
      )
      
      await user.click(screen.getByRole('button', { name: /previous/i }))
      
      expect(mockOnPageChange).toHaveBeenCalledWith(2)
    })

    it('calls onPageChange with next page when clicking next', async () => {
      const user = userEvent.setup()
      render(
        <Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />
      )
      
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      expect(mockOnPageChange).toHaveBeenCalledWith(4)
    })

    it('calls onPageChange when clicking a page number', async () => {
      const user = userEvent.setup()
      render(
        <Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />
      )
      
      await user.click(screen.getByRole('button', { name: /go to page 3/i }))
      
      expect(mockOnPageChange).toHaveBeenCalledWith(3)
    })
  })

  describe('current page indicator', () => {
    it('marks current page with aria-current', () => {
      render(
        <Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />
      )
      
      const currentPageButton = screen.getByRole('button', { name: /go to page 3/i })
      expect(currentPageButton).toHaveAttribute('aria-current', 'page')
    })

    it('does not mark other pages with aria-current', () => {
      render(
        <Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />
      )
      
      const otherPageButton = screen.getByRole('button', { name: /go to page 2/i })
      expect(otherPageButton).not.toHaveAttribute('aria-current')
    })
  })

  describe('ellipsis display', () => {
    it('shows ellipsis when there are many pages', () => {
      render(
        <Pagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />
      )
      
      // Should show ellipsis between page ranges
      const ellipses = screen.getAllByText('...')
      expect(ellipses.length).toBeGreaterThan(0)
    })

    it('shows first page button when current page is far from start', () => {
      render(
        <Pagination currentPage={8} totalPages={10} onPageChange={mockOnPageChange} />
      )
      
      // There should be at least one button with page 1 visible
      const buttons = screen.getAllByRole('button')
      const page1Buttons = buttons.filter(btn => btn.textContent === '1')
      expect(page1Buttons.length).toBeGreaterThan(0)
    })

    it('shows last page button when current page is far from end', () => {
      render(
        <Pagination currentPage={2} totalPages={10} onPageChange={mockOnPageChange} />
      )
      
      // There should be a button with page 10 visible
      const buttons = screen.getAllByRole('button')
      const page10Buttons = buttons.filter(btn => btn.textContent === '10')
      expect(page10Buttons.length).toBeGreaterThan(0)
    })
  })
})
