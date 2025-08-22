import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from '@components/common/Toast'
import ErrorBoundary from '@components/common/ErrorBoundary'
import AuthProvider, { useAuth } from '@contexts/AuthContext'
import LoadingSpinner from '@components/common/LoadingSpinner'

// Pages
import LoginPage from '@pages/auth/LoginPage'
import AdminDashboard from '@pages/admin/AdminDashboard'
import StudentDashboard from '@pages/student/StudentDashboard'
import ExamPage from '@pages/student/ExamPage'

// Private Route Wrapper
const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner fullScreen size="lg" text="Loading application..." />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}

// Public Routes
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner fullScreen size="lg" text="Loading application..." />
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return children
}

// Protected Routes Setup
const ProtectedRoutes = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner fullScreen size="lg" text="Loading application..." />
  }

  return (
    <Routes>
      {/* Public */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />

      {/* Protected */}
      <Route 
        path="/admin/*" 
        element={
          <PrivateRoute requiredRole="ADMIN">
            <AdminDashboard />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/student/*" 
        element={
          <PrivateRoute requiredRole="STUDENT">
            <StudentDashboard />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/exam/:examId" 
        element={
          <PrivateRoute requiredRole="STUDENT">
            <ExamPage />
          </PrivateRoute>
        } 
      />

      {/* Default redirect based on role */}
      <Route 
        path="/" 
        element={
          user ? (
            <Navigate to={user.role === 'ADMIN' ? '/admin' : '/student'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />

      {/* Catch-all route */}
      <Route 
        path="*" 
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Page Not Found</h2>
              <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mr-3"
              >
                Go Back
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Home
              </button>
            </div>
          </div>
        } 
      />
    </Routes>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ToastProvider>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50">
              <ProtectedRoutes />
            </div>
          </AuthProvider>
        </ToastProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
