import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  interactive?: boolean
  onClick?: () => void
}

export function Card({ children, className = '', interactive = false, onClick }: CardProps) {
  const baseStyles = 'overflow-hidden rounded-lg bg-white shadow-xs outline-1 outline-gray-900/5'
  const interactiveStyles = interactive
    ? 'cursor-pointer hover:shadow-sm transition-shadow duration-150'
    : ''

  return (
    <div
      className={`${baseStyles} ${interactiveStyles} ${className}`}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
      <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
        <div className="ml-4 mt-2">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
        {action && <div className="ml-4 mt-2 shrink-0">{action}</div>}
      </div>
    </div>
  )
}

interface CardBodyProps {
  children: ReactNode
  className?: string
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return <div className={`px-4 py-5 sm:p-6 ${className}`}>{children}</div>
}

interface CardFooterProps {
  children: ReactNode
  className?: string
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6 ${className}`}>
      {children}
    </div>
  )
}
