import { useState, useEffect, useCallback } from 'react'
import { apiService } from '@services/apiService'

export const useQuestions = () => {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadQuestions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.getQuestions()
      setQuestions(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load questions')
    } finally {
      setLoading(false)
    }
  }, [])

  const uploadCSV = useCallback(async (file) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiService.uploadCSV(file)
      await loadQuestions() // Reload questions after upload
      return result
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to upload CSV'
      setError(errorMsg)
      throw new Error(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [loadQuestions])

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  return {
    questions,
    loading,
    error,
    uploadCSV,
    loadQuestions
  }
}