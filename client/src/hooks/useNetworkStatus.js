import { useState, useEffect, useCallback } from 'react'

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [connectionType, setConnectionType] = useState('unknown')
  const [effectiveType, setEffectiveType] = useState('4g')

  const updateNetworkStatus = useCallback(() => {
    setIsOnline(navigator.onLine)
    
    // Check Network Information API
    if ('connection' in navigator) {
      const connection = navigator.connection
      setConnectionType(connection.type || 'unknown')
      setEffectiveType(connection.effectiveType || '4g')
    }
  }, [])

  useEffect(() => {
    // Initial check
    updateNetworkStatus()

    // Listen for online/offline events
    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)

    // Listen for connection changes
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', updateNetworkStatus)
    }

    return () => {
      window.removeEventListener('online', updateNetworkStatus)
      window.removeEventListener('offline', updateNetworkStatus)
      if ('connection' in navigator) {
        navigator.connection.removeEventListener('change', updateNetworkStatus)
      }
    }
  }, [updateNetworkStatus])

  // Determine if connection is slow
  const isSlow = effectiveType === '2g' || effectiveType === 'slow-2g'
  
  return {
    isOnline,
    connectionType,
    effectiveType,
    isSlow,
    // Alias for backward compatibility
    connectionType: isSlow ? 'slow' : 'fast',
  }
}

export default useNetworkStatus
