import { useState, useEffect } from 'react'
import { apiService } from '../services/apiService'

// Questions Hook
export const useQuestions = () => {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    setLoading(true)
    try {
      const data = await apiService.getQuestions()
      setQuestions(data)
      setError('')
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to load questions')
    } finally {
      setLoading(false)
    }
  }

  const uploadCSV = async (file) => {
    setLoading(true)
    try {
      const result = await apiService.uploadCSV(file)
      if (result.success) {
        await loadQuestions() // Reload questions
        setError('')
        return result
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to upload CSV'
      setError(errorMsg)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    questions,
    loading,
    error,
    uploadCSV,
    refetch: loadQuestions
  }
}