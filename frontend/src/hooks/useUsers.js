import { useState, useEffect } from 'react'
import { apiService } from '../services/apiService'
import { handleApiError } from '../utils/helpers'

export const useUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiService.getUsers()
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
      const response = await apiService.createUser(userData)
      
      // Refresh users list
      await fetchUsers()
      
      return response
    } catch (err) {
      const errorMessage = handleApiError ? handleApiError(err) : (err.response?.data?.error || err.message || 'Failed to create user')
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
      const response = await apiService.updateUser(userId, userData)
      
      // Update the user in the local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, ...response.user } : user
        )
      )
      
      return response
    } catch (err) {
      const errorMessage = handleApiError ? handleApiError(err) : (err.response?.data?.error || err.message || 'Failed to update user')
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
      const response = await apiService.deleteUser(userId)
      
      // Remove the user from the local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId))
      
      return response
    } catch (err) {
      const errorMessage = handleApiError ? handleApiError(err) : (err.response?.data?.error || err.message || 'Failed to delete user')
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
      const response = await apiService.bulkImportStudents(file)
      
      // Refresh users list
      await fetchUsers()
      
      return response
    } catch (err) {
      const errorMessage = handleApiError ? handleApiError(err) : (err.response?.data?.error || err.message || 'Failed to import students')
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