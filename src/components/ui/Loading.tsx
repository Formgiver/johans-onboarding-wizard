/**
 * Loading states for the application.
 * 
 * Provides consistent loading indicators across all pages.
 */

type LoadingSpinnerProps = {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'size-4',
    md: 'size-6',
    lg: 'size-8',
  }

  return (
    <svg
      className={`animate-spin text-indigo-600 ${sizeClasses[size]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

type LoadingPageProps = {
  message?: string
}

/**
 * Full-page loading state. Use for initial page loads.
 */
export function LoadingPage({ message = 'Loading...' }: LoadingPageProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto" />
        <p className="mt-4 text-sm text-gray-500">{message}</p>
      </div>
    </div>
  )
}

type LoadingCardProps = {
  count?: number
}

/**
 * Skeleton loading state for card grids.
 */
export function LoadingCards({ count = 3 }: LoadingCardProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-gray-200 bg-white p-6"
        >
          <div className="h-4 w-2/3 rounded bg-gray-200" />
          <div className="mt-4 h-3 w-full rounded bg-gray-200" />
          <div className="mt-2 h-3 w-4/5 rounded bg-gray-200" />
          <div className="mt-6 flex items-center justify-between">
            <div className="h-6 w-20 rounded-full bg-gray-200" />
            <div className="h-8 w-8 rounded-full bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Inline loading state for lists and smaller sections.
 */
export function LoadingInline() {
  return (
    <div className="flex items-center justify-center py-8">
      <LoadingSpinner size="md" />
      <span className="ml-3 text-sm text-gray-500">Loading...</span>
    </div>
  )
}
