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
      <div 
        className={`${sizeClasses[size]} border-4 border-sage-200 dark:border-sage-700 border-t-primary rounded-full animate-spin`}
        aria-hidden="true"
      />
      <p className="text-sage-600 dark:text-sage-400 font-medium">
        {message}
      </p>
      <span className="sr-only">{message}</span>
    </div>
  )
}

export default LoadingSpinner

