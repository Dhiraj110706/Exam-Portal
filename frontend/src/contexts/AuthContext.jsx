// import React, { createContext, useContext, useState, useEffect } from 'react'
// import { apiService } from '../services/apiService'

// const AuthContext = createContext()

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     initializeAuth()
//   }, [])

//   const initializeAuth = async () => {
//     try {
//       console.log('Initializing auth...')
//       // Initialize CSRF token first
//       await apiService.initCSRF()
//       console.log('CSRF token initialized')
      
//       // Then check authentication
//       const userData = await apiService.getCurrentUser()
//       console.log('User data:', userData)
//       setUser(userData)
//     } catch (error) {
//       console.log('User not authenticated:', error.message)
//       setUser(null)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const checkAuth = async () => {
//     try {
//       const userData = await apiService.getCurrentUser()
//       setUser(userData)
//     } catch (error) {
//       console.log('Auth check failed:', error.message)
//       setUser(null)
//     }
//   }

//   const login = async (username, password) => {
//     console.log('Attempting login for:', username)
    
//     if (!username || !password) {
//       return { success: false, message: 'Username and password are required' }
//     }

//     try {
//       const result = await apiService.login(username, password)
//       console.log('Login result:', result)
      
//       if (result.success && result.user) {
//         setUser(result.user)
//         return { success: true, user: result.user }
//       } else {
//         return { success: false, message: result.message || 'Login failed' }
//       }
//     } catch (error) {
//       console.error('Login error:', error)
//       const errorMessage = error.response?.data?.message || 
//                           error.response?.data?.error || 
//                           error.message || 
//                           'Network error. Please try again.'
//       return { 
//         success: false, 
//         message: errorMessage
//       }
//     }
//   }

//   const logout = async () => {
//     try {
//       console.log('Attempting logout...')
//       await apiService.logout()
//       console.log('Logout successful')
//     } catch (error) {
//       console.error('Logout failed:', error)
//     } finally {
//       setUser(null)
//       // Force a page refresh to clear any cached data
//       window.location.href = '/login'
//     }
//   }

//   const value = {
//     user,
//     login,
//     logout,
//     loading,
//     checkAuth
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   )
// }
// export default AuthContext

// frontend/src/contexts/AuthContext.jsx

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

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      setLoading(true)
      
      // Initialize CSRF token
      await apiService.initCSRF()
      
      // Check if user is already authenticated
      const userData = await apiService.getCurrentUser()
      setUser(userData)
      
    } catch (error) {
      console.log('Auth initialization failed:', error)
      // User is not authenticated, which is fine
      setUser(null)
    } finally {
      setLoading(false)
      setInitialized(true)
    }
  }

  const login = async (username, password) => {
    try {
      const response = await apiService.login(username, password)
      
      if (response.success) {
        setUser(response.user)
        return { success: true, user: response.user }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error('Login error:', error)
      const message = error.response?.data?.message || 'Login failed. Please try again.'
      return { success: false, message }
    }
  }

  const logout = async () => {
    try {
      await apiService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      // Clear any cached data
      apiService.clearCache()
    }
  }

  const refreshUser = async () => {
    try {
      const userData = await apiService.getCurrentUser()
      setUser(userData)
      return userData
    } catch (error) {
      console.error('Refresh user error:', error)
      setUser(null)
      throw error
    }
  }

  const value = {
    user,
    loading,
    initialized,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isStudent: user?.role === 'STUDENT'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider