function Footer() {
  return (
    <footer className="bg-muted border-t border-default mt-auto">
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-muted text-sm">
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
          <div className="flex items-center gap-6 text-sm text-subtle">
            <span>© {new Date().getFullYear()} Recipe Finder</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
