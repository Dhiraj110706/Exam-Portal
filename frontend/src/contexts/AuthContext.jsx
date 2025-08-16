import React, { createContext, useContext, useState, useEffect } from 'react'
import { apiService } from '@services/apiService'

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
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const userData = await apiService.getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.log('Not authenticated')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    try {
      const result = await apiService.login(username, password)
      if (result.success) {
        setUser(result.user)
        return { success: true, user: result.user }
      } else {
        return { success: false, message: result.message || 'Login failed' }
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Network error. Please try again.' 
      }
    }
  }

  const logout = async () => {
    try {
      await apiService.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setUser(null)
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