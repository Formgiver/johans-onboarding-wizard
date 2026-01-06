import { CheckCircleIcon, ClockIcon, ExclamationCircleIcon, PauseCircleIcon } from '@heroicons/react/20/solid'

/**
 * Wizard and step status definitions.
 * 
 * These map directly to database status values and provide
 * consistent visual treatment across the application.
 */

export type WizardStatus = 'not_started' | 'in_progress' | 'blocked' | 'completed'
export type StepStatus = 'pending' | 'in_progress' | 'completed' | 'skipped'

type StatusConfig = {
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  colors: {
    bg: string
    text: string
    ring: string
    iconColor: string
  }
}

export const wizardStatusConfig: Record<WizardStatus, StatusConfig> = {
  not_started: {
    label: 'Not Started',
    description: 'This wizard has not been started yet',
    icon: ClockIcon,
    colors: {
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      ring: 'ring-gray-600/20',
      iconColor: 'text-gray-400',
    },
  },
  in_progress: {
    label: 'In Progress',
    description: 'This wizard is currently being worked on',
    icon: ClockIcon,
    colors: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      ring: 'ring-blue-700/10',
      iconColor: 'text-blue-500',
    },
  },
  blocked: {
    label: 'Blocked',
    description: 'This wizard requires attention before continuing',
    icon: ExclamationCircleIcon,
    colors: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      ring: 'ring-amber-600/20',
      iconColor: 'text-amber-500',
    },
  },
  completed: {
    label: 'Completed',
    description: 'This wizard has been completed',
    icon: CheckCircleIcon,
    colors: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      ring: 'ring-green-600/20',
      iconColor: 'text-green-500',
    },
  },
}

export const stepStatusConfig: Record<StepStatus, StatusConfig> = {
  pending: {
    label: 'Pending',
    description: 'This step has not been started',
    icon: ClockIcon,
    colors: {
      bg: 'bg-gray-50',
      text: 'text-gray-600',
      ring: 'ring-gray-500/10',
      iconColor: 'text-gray-400',
    },
  },
  in_progress: {
    label: 'In Progress',
    description: 'This step is currently being worked on',
    icon: ClockIcon,
    colors: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      ring: 'ring-blue-700/10',
      iconColor: 'text-blue-500',
    },
  },
  completed: {
    label: 'Completed',
    description: 'This step has been completed',
    icon: CheckCircleIcon,
    colors: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      ring: 'ring-green-600/20',
      iconColor: 'text-green-500',
    },
  },
  skipped: {
    label: 'Skipped',
    description: 'This step was skipped',
    icon: PauseCircleIcon,
    colors: {
      bg: 'bg-gray-50',
      text: 'text-gray-500',
      ring: 'ring-gray-500/10',
      iconColor: 'text-gray-400',
    },
  },
}

type StatusBadgeProps = {
  status: WizardStatus | StepStatus
  variant?: 'wizard' | 'step'
  size?: 'sm' | 'md'
  showIcon?: boolean
}

/**
 * StatusBadge displays the current status of a wizard or step.
 * 
 * Uses consistent color coding across the application:
 * - Gray: Not started / Pending
 * - Blue: In progress
 * - Amber: Blocked / Needs attention
 * - Green: Completed
 */
export function StatusBadge({ status, variant = 'wizard', size = 'sm', showIcon = true }: StatusBadgeProps) {
  const config = variant === 'wizard' 
    ? wizardStatusConfig[status as WizardStatus]
    : stepStatusConfig[status as StepStatus]

  const Icon = config.icon
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-2.5 py-1.5 text-sm'

  return (
    <span
      className={`inline-flex items-center gap-x-1.5 rounded-md font-medium ring-1 ring-inset ${config.colors.bg} ${config.colors.text} ${config.colors.ring} ${sizeClasses}`}
    >
      {showIcon && <Icon className={`size-4 ${config.colors.iconColor}`} aria-hidden="true" />}
      {config.label}
    </span>
  )
}

/**
 * StatusDot is a minimal status indicator for lists and compact views.
 */
export function StatusDot({ status, variant = 'wizard' }: { status: WizardStatus | StepStatus; variant?: 'wizard' | 'step' }) {
  const config = variant === 'wizard'
    ? wizardStatusConfig[status as WizardStatus]
    : stepStatusConfig[status as StepStatus]

  const dotColor = {
    not_started: 'bg-gray-400',
    pending: 'bg-gray-400',
    in_progress: 'bg-blue-500',
    blocked: 'bg-amber-500',
    completed: 'bg-green-500',
    skipped: 'bg-gray-400',
  }[status]

  return (
    <span className="flex items-center gap-x-2">
      <span className={`inline-block size-2 rounded-full ${dotColor}`} aria-hidden="true" />
      <span className="text-sm text-gray-600">{config.label}</span>
    </span>
  )
}
