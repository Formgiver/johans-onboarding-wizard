import { FolderIcon, ClipboardDocumentListIcon, DocumentPlusIcon } from '@heroicons/react/24/outline'
import { Button } from './Button'

type EmptyStateVariant = 'projects' | 'wizards' | 'steps' | 'generic'

type EmptyStateProps = {
  variant?: EmptyStateVariant
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  actionHref?: string
}

const variantConfig = {
  projects: {
    icon: FolderIcon,
    title: 'No projects yet',
    description: 'Get started by creating your first project to begin the onboarding process.',
    actionLabel: 'Create Project',
  },
  wizards: {
    icon: ClipboardDocumentListIcon,
    title: 'No wizards available',
    description: 'This project does not have any active onboarding wizards.',
    actionLabel: 'Start Wizard',
  },
  steps: {
    icon: DocumentPlusIcon,
    title: 'No steps found',
    description: 'This wizard does not have any steps configured.',
    actionLabel: undefined,
  },
  generic: {
    icon: DocumentPlusIcon,
    title: 'Nothing here',
    description: 'There is no content to display.',
    actionLabel: undefined,
  },
}

/**
 * EmptyState provides consistent messaging when there's no content to display.
 * 
 * Uses predefined variants for common scenarios, with full customization available.
 * Always includes a clear message and optional action to remedy the empty state.
 */
export default function EmptyState({
  variant = 'generic',
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
}: EmptyStateProps) {
  const config = variantConfig[variant]
  const Icon = config.icon
  const displayTitle = title ?? config.title
  const displayDescription = description ?? config.description
  const displayAction = actionLabel ?? config.actionLabel

  return (
    <div className="text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-gray-100">
        <Icon className="size-6 text-gray-400" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-gray-900">{displayTitle}</h3>
      <p className="mt-2 text-sm text-gray-500">{displayDescription}</p>
      {displayAction && (onAction || actionHref) && (
        <div className="mt-6">
          {actionHref ? (
            <a href={actionHref}>
              <Button variant="primary" size="sm">
                {displayAction}
              </Button>
            </a>
          ) : (
            <Button variant="primary" size="sm" onClick={onAction}>
              {displayAction}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
