import { useState } from 'react'

function SearchBar({ onSearch, initialValue = '' }) {
  const [query, setQuery] = useState(initialValue)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" role="search">
      <div className="relative">
        <label htmlFor="recipe-search" className="sr-only">
          Search recipes
        </label>
        <input
          id="recipe-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for recipes... (e.g., pasta, chicken, salad)"
          className="input-field pl-12 pr-24 py-4 text-lg"
          aria-describedby="search-hint"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-4"
        >
          Search
        </button>
      </div>
      <p id="search-hint" className="sr-only">
        Enter a recipe name or ingredient to search
      </p>
    </form>
  )
}

export default SearchBar

