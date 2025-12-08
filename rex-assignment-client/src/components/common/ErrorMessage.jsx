function ErrorMessage({ title = 'Error', message, onRetry }) {
  return (
    <div 
      className="card p-6 md:p-8 text-center max-w-md mx-auto"
      role="alert"
      aria-live="assertive"
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-sage-900 dark:text-sage-50 mb-2">
        {title}
      </h3>
      <p className="text-sage-600 dark:text-sage-400 mb-6">
        {message}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Try Again
        </button>
      )}
    </div>
  )
}

export default ErrorMessage

