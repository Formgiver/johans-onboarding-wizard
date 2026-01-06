'use client'

import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showText?: boolean
}

const sizes = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
}

/**
 * Logo component with automatic dark/light mode switching
 * 
 * Place logo files in /public:
 * - logo-light.png (for dark backgrounds / dark mode)
 * - logo-dark.png (for light backgrounds / light mode)
 */
export function Logo({ size = 'md', className = '', showText = true }: LogoProps) {
  const dimension = sizes[size]

  return (
    <div className={`flex items-center gap-x-2 ${className}`}>
      {/* Light mode logo (shown on light backgrounds) */}
      <Image
        src="/logo-dark.png"
        alt="Onboarding Logo"
        width={dimension}
        height={dimension}
        className="block rounded-lg dark:hidden"
        priority
      />
      {/* Dark mode logo (shown on dark backgrounds) */}
      <Image
        src="/logo-light.png"
        alt="Onboarding Logo"
        width={dimension}
        height={dimension}
        className="hidden rounded-lg dark:block"
        priority
      />
      {showText && (
        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          Onboarding
        </span>
      )}
    </div>
  )
}

/**
 * Fallback logo using SVG (when image files are not available)
 */
export function LogoFallback({ size = 'md', className = '', showText = true }: LogoProps) {
  const dimension = sizes[size]

  return (
    <div className={`flex items-center gap-x-2 ${className}`}>
      <div 
        className="flex items-center justify-center rounded-lg bg-indigo-600"
        style={{ width: dimension, height: dimension }}
      >
        <svg 
          className="text-white" 
          style={{ width: dimension * 0.55, height: dimension * 0.55 }}
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V7.3l7-3.11v8.8z"/>
        </svg>
      </div>
      {showText && (
        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          Onboarding
        </span>
      )}
    </div>
  )
}
