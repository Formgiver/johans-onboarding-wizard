import { ReactNode } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const variantStyles = {
  primary:
    'bg-indigo-600 text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-indigo-600',
  secondary:
    'bg-white text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50',
  danger:
    'bg-red-600 text-white shadow-xs hover:bg-red-500 focus-visible:outline-red-600',
}

const sizeStyles = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-2.5 text-sm',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-md font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
