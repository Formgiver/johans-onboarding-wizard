import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/20/solid'
import { ReactNode } from 'react'

type AlertVariant = 'success' | 'error' | 'warning' | 'info'

interface AlertProps {
  variant: AlertVariant
  title?: string
  children: ReactNode
  onDismiss?: () => void
}

const variantConfig = {
  success: {
    bgColor: 'bg-green-50',
    icon: CheckCircleIcon,
    iconColor: 'text-green-400',
    titleColor: 'text-green-800',
    textColor: 'text-green-700',
  },
  error: {
    bgColor: 'bg-red-50',
    icon: XCircleIcon,
    iconColor: 'text-red-400',
    titleColor: 'text-red-800',
    textColor: 'text-red-700',
  },
  warning: {
    bgColor: 'bg-yellow-50',
    icon: ExclamationTriangleIcon,
    iconColor: 'text-yellow-400',
    titleColor: 'text-yellow-800',
    textColor: 'text-yellow-700',
  },
  info: {
    bgColor: 'bg-blue-50',
    icon: InformationCircleIcon,
    iconColor: 'text-blue-400',
    titleColor: 'text-blue-800',
    textColor: 'text-blue-700',
  },
}

export function Alert({ variant, title, children, onDismiss }: AlertProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <div className={`rounded-md ${config.bgColor} p-4`}>
      <div className="flex">
        <div className="shrink-0">
          <Icon aria-hidden="true" className={`size-5 ${config.iconColor}`} />
        </div>
        <div className="ml-3">
          {title && (
            <h3 className={`text-sm font-medium ${config.titleColor}`}>{title}</h3>
          )}
          <div className={`${title ? 'mt-2' : ''} text-sm ${config.textColor}`}>
            {children}
          </div>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className={`inline-flex rounded-md ${config.bgColor} p-1.5 ${config.textColor} hover:${config.bgColor.replace('50', '100')} focus-visible:ring-2 focus-visible:ring-offset-2`}
              >
                <span className="sr-only">Dismiss</span>
                <XCircleIcon aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
