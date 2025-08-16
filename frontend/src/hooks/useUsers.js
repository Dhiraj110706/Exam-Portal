import { useState, useEffect, useCallback } from 'react'
import { apiService } from '@services/apiService'

export const useUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.getStudents()
      setUsers(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [])

  const createUser = useCallback(async (userData) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiService.createUser(userData)
      await loadUsers() // Reload users after creation
      return result
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create user'
      setError(errorMsg)
      throw new Error(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [loadUsers])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  return {
    users,
    loading,
    error,
    createUser,
    loadUsers
  }
}