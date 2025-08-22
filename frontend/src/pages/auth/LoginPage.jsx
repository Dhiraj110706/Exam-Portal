import React, { useState } from 'react'
import { useAuth } from '@contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import { Eye, EyeOff, Shield, Lock, Monitor, Award } from 'lucide-react'

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login, user } = useAuth()

  // If already logged in, redirect
  if (user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (loading) return
    
    setLoading(true)
    setError('')

    try {
      const result = await login(credentials.username, credentials.password)
      if (!result.success) {
        setError(result.message)
      }
      // If successful, the AuthContext will handle the redirect
    } catch (error) {
      console.error('Login error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setCredentials(prev => ({ ...prev, [field]: value }))
    if (error) setError('') // Clear error when user types
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        {/* Left side - Branding and information */}
        <div className="w-full md:w-2/5 bg-indigo-600 p-8 text-white flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-white/20 p-3 rounded-full mr-3">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Secure Exam System</h1>
            </div>
            <p className="text-md text-white/90 mb-6 italic">
              "Where integrity meets innovation in assessment"
            </p>
            <p className="text-white/80 text-sm">
              Our secure examination platform ensures fair and monitored testing environments for all users.
            </p>
          </div>
          
        </div>
        
        {/* Right side - Login Form */}
        <div className="w-full md:w-3/5 p-8 bg-white">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 mt-2">Sign in to access your exam dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 transition-colors"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-12 disabled:opacity-50 transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !credentials.username || !credentials.password}
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : 'Sign In'}
            </button>
          </form>


          {/* Footer note */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-xs">
              Secure Exam System v2.0 • Advanced anti-cheating protection
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage