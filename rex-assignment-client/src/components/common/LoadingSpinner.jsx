import { Loader2 } from 'lucide-react'

function LoadingSpinner({ size = 'default', message = 'Loading...' }) {
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-10 h-10',
    large: 'w-16 h-16',
  }

  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-12"
      role="status"
      aria-live="polite"
    >
      <Loader2
        className={`${sizeClasses[size]} text-primary animate-spin`}
        aria-hidden="true"
      />
      <p className="text-muted font-medium">
        {message}
      </p>
      <span className="sr-only">{message}</span>
    </div>
  )
}

export default LoadingSpinner
