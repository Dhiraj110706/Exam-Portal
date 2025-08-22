import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  Settings,
  FileText,
  UserPlus,
  AlertCircle
} from 'lucide-react'
import Layout from '@components/layout/Layout'
import ErrorBoundary from '@components/common/ErrorBoundary'
import LoadingSpinner  from '@components/common/LoadingSpinner'
import { useToast } from '@components/common/Toast'
import { useAuth } from '@contexts/AuthContext'
import QuestionsExamsPage from './QuestionsExamsPage'
import UserManagementPage from './UserManagementPage'
import ResultsPage from './ResultsPage'
import DashboardOverview from './DashboardOverview'

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const { user, isAdmin, logout } = useAuth()

  useEffect(() => {
    // Additional admin-specific initialization if needed
    if (user && !isAdmin) {
      toast.error('Access denied. Admin privileges required.')
      navigate('/login')
    }
  }, [user, isAdmin, navigate, toast])

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/admin', 
      icon: BarChart3,
      description: 'Overview and statistics'
    },
    { 
      name: 'Questions & Exams', 
      href: '/admin/questions', 
      icon: BookOpen,
      description: 'Manage questions and create exams'
    },
    { 
      name: 'User Management', 
      href: '/admin/users', 
      icon: Users,
      description: 'Add and manage students'
    },
    { 
      name: 'Results', 
      href: '/admin/results', 
      icon: FileText,
      description: 'View exam results and reports'
    },
    { 
      name: 'Settings', 
      href: '/admin/settings', 
      icon: Settings,
      description: 'System configuration'
    },
  ]

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner 
          fullScreen 
          size="lg"
          text="Loading admin dashboard..." 
        />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Access Error
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex space-x-3 justify-center">
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Main dashboard content
  return (
    <ErrorBoundary>
      <Layout
        title="Admin Dashboard"
        subtitle={`Welcome back, ${user?.username || 'Admin'}`}
        navigation={navigation}
        user={user}
      >
        <Routes>
          <Route 
            path="/" 
            element={
              <ErrorBoundary>
                <DashboardOverview />
              </ErrorBoundary>
            } 
          />
          <Route 
            path="/questions" 
            element={
              <ErrorBoundary>
                <QuestionsExamsPage />
              </ErrorBoundary>
            } 
          />
          <Route 
            path="/users" 
            element={
              <ErrorBoundary>
                <UserManagementPage />
              </ErrorBoundary>
            } 
          />
          <Route 
            path="/results" 
            element={
              <ErrorBoundary>
                <ResultsPage />
              </ErrorBoundary>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <div className="p-8 text-center">
                <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Settings</h3>
                <p className="text-gray-500 mb-6">
                  System settings and configuration options will be available here soon.
                </p>
                <div className="max-w-md mx-auto bg-white rounded-lg p-6 shadow-sm">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Coming Soon</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Exam duration settings</li>
                    <li>• Violation thresholds</li>
                    <li>• Email notifications</li>
                    <li>• System backups</li>
                    <li>• User permissions</li>
                  </ul>
                </div>
              </div>
            } 
          />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  )
}

export default AdminDashboard