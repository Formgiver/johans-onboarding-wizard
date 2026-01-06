/**
 * ProgressRing displays progress as a circular indicator.
 * 
 * Used for compact progress display in cards and lists.
 */

type ProgressRingProps = {
  progress: number // 0-100
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export default function ProgressRing({ progress, size = 'md', showLabel = true }: ProgressRingProps) {
  const sizeConfig = {
    sm: { width: 32, strokeWidth: 3, fontSize: 'text-xs' },
    md: { width: 48, strokeWidth: 4, fontSize: 'text-sm' },
    lg: { width: 64, strokeWidth: 5, fontSize: 'text-base' },
  }

  const { width, strokeWidth, fontSize } = sizeConfig[size]
  const radius = (width - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  // Color based on progress
  const progressColor = progress === 100 
    ? 'text-green-500' 
    : progress > 0 
      ? 'text-indigo-600' 
      : 'text-gray-300'

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width, height: width }}>
      <svg className="rotate-[-90deg]" width={width} height={width}>
        {/* Background circle */}
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={width / 2}
          cy={width / 2}
        />
        {/* Progress circle */}
        <circle
          className={`${progressColor} transition-all duration-300 ease-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={width / 2}
          cy={width / 2}
        />
      </svg>
      {showLabel && (
        <span className={`absolute inset-0 flex items-center justify-center ${fontSize} font-semibold text-gray-700`}>
          {Math.round(progress)}%
        </span>
      )}
    </div>
  )
}
