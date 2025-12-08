import { Link } from 'react-router-dom'

function RecipeCard({ recipe }) {
  const { id, title, image } = recipe

  return (
    <Link
      to={`/recipe/${id}`}
      className="card card-hover overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      aria-label={`View recipe: ${title}`}
    >
      <div className="aspect-[4/3] overflow-hidden bg-sage-100 dark:bg-sage-700">
        {image ? (
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-16 h-16 text-sage-300 dark:text-sage-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-sage-900 dark:text-sage-50 line-clamp-2 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
          {title}
        </h3>
        <div className="mt-3 flex items-center gap-2 text-sm text-primary dark:text-primary-light font-medium">
          <span>View Recipe</span>
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  )
}

export default RecipeCard

