import { ReactNode } from 'react'

type BadgeVariant = 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  gray: 'bg-gray-50 text-gray-600 ring-gray-500/10',
  red: 'bg-red-50 text-red-700 ring-red-600/10',
  yellow: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
  green: 'bg-green-50 text-green-700 ring-green-600/20',
  blue: 'bg-blue-50 text-blue-700 ring-blue-700/10',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-700/10',
  purple: 'bg-purple-50 text-purple-700 ring-purple-700/10',
  pink: 'bg-pink-50 text-pink-700 ring-pink-700/10',
}

export function Badge({ children, variant = 'gray', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

// Status-specific badge for wizard statuses
export function StatusBadge({ status }: { status: string }) {
  const statusVariants: Record<string, BadgeVariant> = {
    DRAFT: 'gray',
    ACTIVE: 'blue',
    WAITING_ON_CUSTOMER: 'yellow',
    COMPLETED: 'green',
    ARCHIVED: 'gray',
  }

  return <Badge variant={statusVariants[status] || 'gray'}>{status.replace(/_/g, ' ')}</Badge>
}
