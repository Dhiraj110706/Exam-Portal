import { useState, useCallback } from 'react'
import { apiService } from '@services/apiService'

export const useExam = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createExam = useCallback(async (examData, selectedQuestions) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiService.createExam({
        ...examData,
        question_ids: selectedQuestions.map(q => q.id)
      })
      return result
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create exam')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const submitExam = useCallback(async (examId, submissionData) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiService.submitExam(examId, submissionData)
      return result
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit exam')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    createExam,
    submitExam
  }
}