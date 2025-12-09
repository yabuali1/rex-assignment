import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
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
              <BookOpen className="w-6 h-6 text-white" aria-hidden="true" />
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
