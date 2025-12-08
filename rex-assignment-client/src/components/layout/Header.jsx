import { Link } from 'react-router-dom'
import ThemeToggle from '../common/ThemeToggle'

function Header({ darkMode, toggleDarkMode }) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-sage-900/80 backdrop-blur-lg border-b border-sage-200 dark:border-sage-700">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
            aria-label="Recipe Finder Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <svg 
                className="w-6 h-6 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                />
              </svg>
            </div>
            <div>
              <span className="font-display text-xl font-bold text-sage-900 dark:text-sage-50">
                Recipe Finder
              </span>
              <span className="hidden sm:block text-xs text-sage-500 dark:text-sage-400">
                Discover delicious recipes
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-4" aria-label="Main navigation">
            <Link 
              to="/"
              className="text-sage-600 dark:text-sage-300 hover:text-primary dark:hover:text-primary-light font-medium transition-colors"
            >
              Search
            </Link>
            <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

