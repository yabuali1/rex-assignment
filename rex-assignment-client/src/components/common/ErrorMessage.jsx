import { AlertTriangle } from 'lucide-react'

function ErrorMessage({ title = 'Error', message, onRetry }) {
  return (
    <div 
      className="card p-6 md:p-8 text-center max-w-md mx-auto"
      role="alert"
      aria-live="assertive"
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-red-500" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-bold text-default mb-2">
        {title}
      </h3>
      <p className="text-muted mb-6">
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
