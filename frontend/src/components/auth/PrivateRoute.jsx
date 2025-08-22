
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext'
import { LoadingSpinner } from '@components/common/LoadingSpinner'

const PrivateRoute = ({ children, requiredRole = null }) => {
  const { user, loading, initialized } = useAuth()
  const location = useLocation()

  // Show loading while authentication is being checked
  if (loading || !initialized) {
    return <LoadingSpinner fullScreen size="lg" text="Verifying authentication..." />
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role-based access
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = user.role === 'ADMIN' ? '/admin' : '/student'
    return <Navigate to={redirectPath} replace />
  }

  // User is authenticated and has required role
  return children
}

export default PrivateRoute