import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LoadingSpinner from '../ui/LoadingSpinner'

export function ProtectedRoute({ children }) {
  const location = useLocation()
  const { isAuthenticated, currentUser, isLoading } = useSelector(state => state.user)
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token')
  const isHydrating = hasToken && (!isAuthenticated || !currentUser)

  console.log('ProtectedRoute check:', {
    hasToken,
    isAuthenticated,
    currentUser: currentUser ? 'exists' : 'null',
    isLoading,
    isHydrating,
  })

  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (isHydrating || isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (!currentUser && isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export function PublicRoute({ children }) {
  const { isAuthenticated } = useSelector(state => state.user)
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}
