import React, { createContext, useContext, useState, useEffect } from 'react'
import { apiService } from '../services/apiService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      console.log('Initializing auth...')
      // Initialize CSRF token first
      await apiService.initCSRF()
      console.log('CSRF token initialized')
      
      // Then check authentication
      const userData = await apiService.getCurrentUser()
      console.log('User data:', userData)
      setUser(userData)
    } catch (error) {
      console.log('User not authenticated:', error.message)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const checkAuth = async () => {
    try {
      const userData = await apiService.getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.log('Auth check failed:', error.message)
      setUser(null)
    }
  }

  const login = async (username, password) => {
    console.log('Attempting login for:', username)
    
    if (!username || !password) {
      return { success: false, message: 'Username and password are required' }
    }

    try {
      const result = await apiService.login(username, password)
      console.log('Login result:', result)
      
      if (result.success && result.user) {
        setUser(result.user)
        return { success: true, user: result.user }
      } else {
        return { success: false, message: result.message || 'Login failed' }
      }
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Network error. Please try again.'
      return { 
        success: false, 
        message: errorMessage
      }
    }
  }

  const logout = async () => {
    try {
      console.log('Attempting logout...')
      await apiService.logout()
      console.log('Logout successful')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setUser(null)
      // Force a page refresh to clear any cached data
      window.location.href = '/login'
    }
  }

  const value = {
    user,
    login,
    logout,
    loading,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}