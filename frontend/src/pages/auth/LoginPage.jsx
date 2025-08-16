import React, { useState } from 'react'
import { useAuth } from '@contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import Button from '@components/common/Button'
import Input from '@components/common/Input'
import Alert from '@components/common/Alert'
import { Eye, EyeOff, Shield } from 'lucide-react'

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
    setLoading(true)
    setError('')

    try {
      const result = await login(credentials.username, credentials.password)
      if (!result.success) {
        setError(result.message)
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setCredentials(prev => ({ ...prev, [field]: value }))
    if (error) setError('') // Clear error when user types
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Secure Exam System</h1>
            <p className="text-white/80 mt-2">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="text"
                label="Username"
                value={credentials.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                required
                className="bg-white/20 border-white/30 text-white placeholder-white/60"
                placeholder="Enter your username"
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={credentials.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                className="bg-white/20 border-white/30 text-white placeholder-white/60 pr-12"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-white/60 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <Alert
                type="error"
                message={error}
                className="bg-red-500/20 border-red-500/30 text-white"
              />
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full bg-white text-purple-700 hover:bg-white/90 font-semibold py-3"
              size="large"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-white/10 rounded-lg border border-white/20">
            <h3 className="text-white font-semibold mb-3">Demo Credentials</h3>
            <div className="space-y-2 text-sm text-white/80">
              <div className="flex justify-between">
                <span>Admin:</span>
                <span className="font-mono">admin / password</span>
              </div>
              <div className="flex justify-between">
                <span>Student:</span>
                <span className="font-mono">student / password</span>
              </div>
            </div>
            <p className="text-xs text-white/60 mt-2">
              Use these credentials to explore the system
            </p>
          </div>

          {/* Features */}
          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Advanced anti-cheating • Real-time monitoring • Secure exams
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage