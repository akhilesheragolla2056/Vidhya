function LoadingSpinner({ size = 'default', text = 'Loading...' }) {
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-12 h-12',
    large: 'w-16 h-16',
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] py-8">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
        {/* Spinning gradient arc */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-coral animate-spin"></div>
        {/* Inner pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-teal rounded-full animate-pulse"></div>
        </div>
      </div>
      {text && (
        <p className="mt-4 text-gray-600 font-medium animate-pulse">{text}</p>
      )}
    </div>
  )
}

export default LoadingSpinner
