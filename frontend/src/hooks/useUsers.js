import { useState, useEffect } from 'react'
import { handleApiError } from '../utils/helpers'

// API utility function
const apiRequest = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    data = null,
    headers = {},
    ...otherOptions
  } = options

  // Get CSRF token from cookies
  const getCSRFToken = () => {
    const name = 'csrftoken'
    let cookieValue = null
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';')
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim()
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
          break
        }
      }
    }
    return cookieValue
  }

  // Prepare request configuration
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCSRFToken(),
      ...headers
    },
    credentials: 'include',
    ...otherOptions
  }

  // Add body data if provided
  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.body = JSON.stringify(data)
  }

  try {
    const response = await fetch(`/api${endpoint}`, config)
    
    // Handle different response types
    let responseData
    const contentType = response.headers.get('content-type')
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json()
    } else {
      responseData = await response.text()
    }

    if (!response.ok) {
      // Handle error response
      const errorMessage = responseData?.error || responseData?.message || `Request failed with status ${response.status}`
      throw new Error(errorMessage)
    }

    return responseData
  } catch (error) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.')
    }
    throw error
  }
}

export const useUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiRequest('/users/')
      setUsers(response)
    } catch (err) {
      const errorMessage = handleApiError ? handleApiError(err) : (err.message || 'Failed to fetch users')
      setError(errorMessage)
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  // Create user
  const createUser = async (userData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiRequest('/create-user/', {
        method: 'POST',
        data: userData
      })
      
      // Refresh users list
      await fetchUsers()
      
      return response
    } catch (err) {
      const errorMessage = handleApiError ? handleApiError(err) : (err.message || 'Failed to create user')
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Update user
  const updateUser = async (userId, userData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiRequest(`/users/${userId}/`, {
        method: 'PUT',
        data: userData
      })
      
      // Update the user in the local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, ...response.user } : user
        )
      )
      
      return response
    } catch (err) {
      const errorMessage = handleApiError ? handleApiError(err) : (err.message || 'Failed to update user')
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Delete user
  const deleteUser = async (userId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiRequest(`/users/${userId}/delete/`, {
        method: 'DELETE'
      })
      
      // Remove the user from the local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId))
      
      return response
    } catch (err) {
      const errorMessage = handleApiError ? handleApiError(err) : (err.message || 'Failed to delete user')
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Bulk import students
  const bulkImportStudents = async (file) => {
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      // Get CSRF token
      const getCSRFToken = () => {
        const name = 'csrftoken'
        let cookieValue = null
        if (document.cookie && document.cookie !== '') {
          const cookies = document.cookie.split(';')
          for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim()
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
              break
            }
          }
        }
        return cookieValue
      }
      
      const response = await fetch('/api/bulk-import-students/', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'X-CSRFToken': getCSRFToken()
        }
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Import failed')
      }
      
      // Refresh users list
      await fetchUsers()
      
      return data
    } catch (err) {
      const errorMessage = handleApiError ? handleApiError(err) : (err.message || 'Failed to import students')
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Reset error
  const clearError = () => {
    setError(null)
  }

  // Load users on hook initialization
  useEffect(() => {
    fetchUsers()
  }, [])

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    bulkImportStudents,
    fetchUsers,
    clearError
  }
}