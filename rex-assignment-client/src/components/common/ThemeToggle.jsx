import { Sun, Moon } from 'lucide-react'

function ThemeToggle({ darkMode, toggleDarkMode }) {
  return (
    <button
      onClick={toggleDarkMode}
      className="relative p-2 rounded-lg bg-sage-100 dark:bg-sage-700 hover:bg-sage-200 dark:hover:bg-sage-600 transition-colors"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={darkMode}
    >
      <span className="sr-only">
        {darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      </span>
      
      {/* Sun icon */}
      <Sun
        className={`w-5 h-5 text-amber-500 transition-all duration-300 ${
          darkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
        }`}
        aria-hidden="true"
      />
      
      {/* Moon icon */}
      <Moon
        className={`w-5 h-5 text-indigo-400 absolute inset-0 m-auto transition-all duration-300 ${
          darkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
        }`}
        aria-hidden="true"
      />
    </button>
  )
}

export default ThemeToggle
