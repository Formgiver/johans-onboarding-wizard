/**
 * PageHeader component for consistent page titles and actions.
 * 
 * Provides a standard layout for:
 * - Page title with optional description
 * - Primary and secondary actions
 * - Metadata (status badges, etc.)
 */

type PageHeaderProps = {
  title: string
  description?: string
  children?: React.ReactNode // For action buttons
  metadata?: React.ReactNode // For status badges, progress indicators
}

export default function PageHeader({ title, description, children, metadata }: PageHeaderProps) {
  return (
    <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-4xl text-sm text-gray-500">
            {description}
          </p>
        )}
        {metadata && (
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            {metadata}
          </div>
        )}
      </div>
      {children && (
        <div className="mt-4 flex shrink-0 items-center gap-x-3 sm:ml-4 sm:mt-0">
          {children}
        </div>
      )}
    </div>
  )
}
