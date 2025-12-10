import { Link } from 'react-router-dom'
import { ChevronRight, ImageOff } from 'lucide-react'
import { getImageUrl, IMAGE_SIZES } from '../../utils/imageUtils'

function RecipeCard({ recipe }) {
  const { id, title, image } = recipe

  // Use large size (480x360) for better quality in cards
  const optimizedImage = getImageUrl(image, IMAGE_SIZES.LARGE)

  return (
    <div
      role="listitem"
      className="card card-hover overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <Link
        to={`/recipe/${id}`}
        aria-label={`View recipe: ${title}`}
      >
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          {image ? (
            <img
              src={optimizedImage}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff className="w-16 h-16 text-subtle" aria-hidden="true" />
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-display text-lg font-semibold text-default line-clamp-2 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
            {title}
          </h3>
          <div className="mt-3 flex items-center gap-2 text-sm text-primary dark:text-primary-light font-medium">
            <span>View Recipe</span>
            <ChevronRight
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            />
          </div>
        </div>
      </Link>
    </div>
  )
}

export default RecipeCard
