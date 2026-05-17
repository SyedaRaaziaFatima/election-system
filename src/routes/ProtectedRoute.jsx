import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LoadingSpinner } from '../components/LoadingSpinner'

export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isLoading, profile } = useAuth()

  if (isLoading) return <LoadingSpinner />

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to="/" />
  }

  return children
}
