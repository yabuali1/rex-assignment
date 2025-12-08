function Footer() {
  return (
    <footer className="bg-sage-100 dark:bg-sage-800 border-t border-sage-200 dark:border-sage-700 mt-auto">
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sage-600 dark:text-sage-400 text-sm">
              Powered by{' '}
              <a 
                href="https://spoonacular.com/food-api" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-dark dark:text-primary-light transition-colors font-medium"
              >
                Spoonacular API
              </a>
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-sage-500 dark:text-sage-400">
            <span>© {new Date().getFullYear()} Recipe Finder</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

