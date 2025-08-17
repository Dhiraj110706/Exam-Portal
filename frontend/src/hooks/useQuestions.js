// import { useState, useEffect } from 'react'
// import { apiService } from '../services/apiService'

// // Questions Hook
// export const useQuestions = () => {
//   const [questions, setQuestions] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')

//   useEffect(() => {
//     loadQuestions()
//   }, [])

//   const loadQuestions = async () => {
//     setLoading(true)
//     try {
//       const data = await apiService.getQuestions()
//       setQuestions(data)
//       setError('')
//     } catch (error) {
//       setError(error.response?.data?.error || 'Failed to load questions')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const uploadCSV = async (file) => {
//     setLoading(true)
//     try {
//       const result = await apiService.uploadCSV(file)
//       if (result.success) {
//         await loadQuestions() // Reload questions
//         setError('')
//         return result
//       }
//     } catch (error) {
//       const errorMsg = error.response?.data?.error || 'Failed to upload CSV'
//       setError(errorMsg)
//       throw error
//     } finally {
//       setLoading(false)
//     }
//   }

//   return {
//     questions,
//     loading,
//     error,
//     uploadCSV,
//     refetch: loadQuestions
//   }
// }

// hooks/useQuestions.js
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
      console.log('useQuestions: Loading questions...')
      const data = await apiService.getQuestions()
      console.log('useQuestions: Loaded questions:', data)
      setQuestions(data)
    } catch (err) {
      console.error('useQuestions: Load error:', err)
      const errorMsg = err.response?.data?.error || 'Failed to load questions'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [])

  const uploadCSV = useCallback(async (file) => {
    setLoading(true)
    setError(null)
    try {
      console.log('useQuestions: Uploading CSV...')
      const result = await apiService.uploadCSV(file)
      console.log('useQuestions: CSV uploaded:', result)
      
      // Reload questions after successful upload
      await loadQuestions()
      
      return result
    } catch (err) {
      console.error('useQuestions: Upload error:', err)
      const errorMsg = err.response?.data?.error || 'Failed to upload CSV'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [loadQuestions])

  const createQuestion = useCallback(async (questionData) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiService.createQuestion(questionData)
      await loadQuestions() // Reload questions after creation
      return result
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create question'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [loadQuestions])

  const deleteQuestion = useCallback(async (questionId) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiService.deleteQuestion(questionId)
      await loadQuestions() // Reload questions after deletion
      return result
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete question'
      setError(errorMsg)
      throw err
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
    createQuestion,
    deleteQuestion,
    loadQuestions,
    clearError: () => setError(null)
  }
}