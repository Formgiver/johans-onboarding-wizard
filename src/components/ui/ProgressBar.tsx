import { ReactNode } from 'react'

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'success' | 'warning' | 'danger'
}

const sizeStyles = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

const variantStyles = {
  primary: 'bg-indigo-600',
  success: 'bg-green-600',
  warning: 'bg-yellow-600',
  danger: 'bg-red-600',
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = false,
  size = 'md',
  variant = 'primary',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div>
      {(label || showPercentage) && (
        <div className="mb-2 flex items-center justify-between">
          {label && <span className="text-sm font-medium text-gray-900">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-900">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={`overflow-hidden rounded-full bg-gray-200 ${sizeStyles[size]}`}>
        <div
          className={`${sizeStyles[size]} rounded-full ${variantStyles[variant]} transition-all duration-300 ease-in-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// Wizard-specific progress component
interface WizardProgressProps {
  completedSteps: number
  totalSteps: number
  percentage: number
}

export function WizardProgress({ completedSteps, totalSteps, percentage }: WizardProgressProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">
          Step {completedSteps} of {totalSteps}
        </span>
        <span className="font-medium text-gray-900">{Math.round(percentage)}% Complete</span>
      </div>
      <ProgressBar value={percentage} max={100} variant="primary" size="md" />
    </div>
  )
}
