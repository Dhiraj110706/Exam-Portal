import { useState } from 'react'
import { apiService } from '@services/apiService'

export const useExam = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createExam = async (examData) => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('useExam: Creating exam with data:', examData)
      
      // Validate that question_ids exists and is an array
      if (!examData.question_ids || !Array.isArray(examData.question_ids) || examData.question_ids.length === 0) {
        throw new Error('No questions selected for exam')
      }
      
      const response = await apiService.createExam(examData)
      console.log('useExam: Exam created successfully:', response)
      return response
    } catch (error) {
      console.error('useExam: Create exam error:', error)
      const errorMsg = error.response?.data?.error || error.message || 'Failed to create exam'
      setError(errorMsg)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getExams = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiService.getExams()
      return response
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to load exams'
      setError(errorMsg)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getExamDetails = async (examId) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiService.getExamDetails(examId)
      return response
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to load exam details'
      setError(errorMsg)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const submitExam = async (examId, examData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiService.submitExam(examId, examData)
      return response
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to submit exam'
      setError(errorMsg)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    createExam,
    getExams,
    getExamDetails,
    submitExam,
    loading,
    error,
    clearError: () => setError(null)
  }
}