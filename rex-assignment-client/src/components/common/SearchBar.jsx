import { useState, useEffect, useTransition, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, BookOpen, Loader2 } from 'lucide-react'
import { recipeApi } from '../../services/api'

function SearchBar({ onSearch, initialValue = '' }) {
  const [query, setQuery] = useState(initialValue)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)
  const navigate = useNavigate()

  const SUGGESTIONS_NUMBER = 8

  // Debounced fetch suggestions
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([])
      return
    }

    const timeoutId = setTimeout(() => {
      // Use startTransition to give this low priority
      startTransition(() => {
        recipeApi.getAutocompleteSuggestions(query, SUGGESTIONS_NUMBER)
          .then(data => {
            setSuggestions(data || [])
          })
          .catch(() => {
            setSuggestions([])
          })
      })
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [query])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target) &&
        !inputRef.current?.contains(e.target)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setShowSuggestions(false)
    onSearch(query)
  }

  const handleInputChange = (e) => {
    setQuery(e.target.value)
    setShowSuggestions(true)
    setSelectedIndex(-1)
  }

  const handleSuggestionClick = useCallback((suggestion) => {
    setQuery(suggestion.title)
    setShowSuggestions(false)
    // Navigate directly to the recipe
    navigate(`/recipe/${suggestion.id}`)
  }, [navigate])

  const handleSearchSuggestion = useCallback((suggestion) => {
    setQuery(suggestion.title)
    setShowSuggestions(false)
    onSearch(suggestion.title)
  }, [onSearch])

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault()
          handleSuggestionClick(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" role="search">
      <div className="relative">
        <label htmlFor="recipe-search" className="sr-only">
          Search recipes
        </label>
        <input
          ref={inputRef}
          id="recipe-search"
          type="search"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for recipes... (e.g., pasta, chicken, salad)"
          className="input-field pl-12 pr-24 py-4 text-lg"
          aria-describedby="search-hint"
          aria-expanded={showSuggestions && suggestions.length > 0}
          aria-controls="search-suggestions"
          aria-autocomplete="list"
          autoComplete="off"
        />
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400"
          aria-hidden="true"
        />

        {/* Loading indicator */}
        {isPending && (
          <div className="absolute right-24 top-1/2 -translate-y-1/2">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
        )}

        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-4"
        >
          Search
        </button>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <ul
            ref={suggestionsRef}
            id="search-suggestions"
            className="absolute z-50 w-full mt-2 bg-white dark:bg-sage-800 rounded-xl shadow-xl border border-sage-200 dark:border-sage-700 overflow-hidden"
            role="listbox"
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.id}
                role="option"
                aria-selected={index === selectedIndex}
                className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${index === selectedIndex
                    ? 'bg-primary/10 dark:bg-primary/20'
                    : 'hover:bg-sage-50 dark:hover:bg-sage-700/50'
                  }`}
              >
                <button
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="flex items-center gap-3 flex-grow text-left"
                >
                  <BookOpen className="w-4 h-4 text-sage-400 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sage-900 dark:text-sage-100 truncate">
                    {suggestion.title}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSearchSuggestion(suggestion)
                  }}
                  className="ml-2 p-1.5 rounded-lg hover:bg-sage-200 dark:hover:bg-sage-600 transition-colors"
                  title="Search for this recipe"
                  aria-label={`Search for ${suggestion.title}`}
                >
                  <Search className="w-4 h-4 text-sage-500" />
                </button>
              </li>
            ))}
            <li className="px-4 py-2 text-xs text-sage-500 dark:text-sage-400 bg-sage-50 dark:bg-sage-900/50 border-t border-sage-200 dark:border-sage-700">
              Click recipe to view details • Click 🔍 to search
            </li>
          </ul>
        )}
      </div>
      <p id="search-hint" className="sr-only">
        Enter a recipe name or ingredient to search. Suggestions will appear as you type.
      </p>
    </form>
  )
}

export default SearchBar
