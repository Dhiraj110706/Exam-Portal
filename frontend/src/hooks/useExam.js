// // import { useState, useCallback } from 'react'
// // import { apiService } from '@services/apiService'

// // export const useExam = () => {
// //   const [loading, setLoading] = useState(false)
// //   const [error, setError] = useState(null)

// //   const createExam = useCallback(async (examData, selectedQuestions) => {
// //     setLoading(true)
// //     setError(null)
// //     try {
// //       const result = await apiService.createExam({
// //         ...examData,
// //         question_ids: selectedQuestions.map(q => q.id)
// //       })
// //       return result
// //     } catch (err) {
// //       setError(err.response?.data?.error || 'Failed to create exam')
// //       throw err
// //     } finally {
// //       setLoading(false)
// //     }
// //   }, [])

// //   const submitExam = useCallback(async (examId, submissionData) => {
// //     setLoading(true)
// //     setError(null)
// //     try {
// //       const result = await apiService.submitExam(examId, submissionData)
// //       return result
// //     } catch (err) {
// //       setError(err.response?.data?.error || 'Failed to submit exam')
// //       throw err
// //     } finally {
// //       setLoading(false)
// //     }
// //   }, [])

// //   return {
// //     loading,
// //     error,
// //     createExam,
// //     submitExam
// //   }
// // }


// import { useState, useEffect } from 'react'
// import { apiService } from '../services/apiService'

// export const useExam = () => {
//   const [exams, setExams] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')

//   useEffect(() => {
//     loadExams()
//   }, [])

//   const loadExams = async () => {
//     setLoading(true)
//     try {
//       const data = await apiService.getExams()
//       setExams(data)
//       setError('')
//     } catch (error) {
//       setError(error.response?.data?.error || 'Failed to load exams')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const createExam = async (examData, selectedQuestions) => {
//     setLoading(true)
//     try {
//       const result = await apiService.createExam({
//         ...examData,
//         question_ids: selectedQuestions.map(q => q.id)
//       })
      
//       if (result.success) {
//         await loadExams() // Reload exams
//         setError('')
//         return result
//       }
//     } catch (error) {
//       const errorMsg = error.response?.data?.error || 'Failed to create exam'
//       setError(errorMsg)
//       throw error
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getExamDetails = async (examId) => {
//     setLoading(true)
//     try {
//       const data = await apiService.getExamDetails(examId)
//       setError('')
//       return data
//     } catch (error) {
//       const errorMsg = error.response?.data?.error || 'Failed to get exam details'
//       setError(errorMsg)
//       throw error
//     } finally {
//       setLoading(false)
//     }
//   }

//   const submitExam = async (examId, submissionData) => {
//     setLoading(true)
//     try {
//       const result = await apiService.submitExam(examId, submissionData)
//       setError('')
//       return result
//     } catch (error) {
//       const errorMsg = error.response?.data?.error || 'Failed to submit exam'
//       setError(errorMsg)
//       throw error
//     } finally {
//       setLoading(false)
//     }
//   }

//   return {
//     exams,
//     loading,
//     error,
//     createExam,
//     getExamDetails,
//     submitExam,
//     refetch: loadExams
//   }
// }

// // Users Hook
// export const useUsers = () => {
//   const [users, setUsers] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')

//   useEffect(() => {
//     loadUsers()
//   }, [])

//   const loadUsers = async () => {
//     setLoading(true)
//     try {
//       const data = await apiService.getStudents()
//       setUsers(data)
//       setError('')
//     } catch (error) {
//       setError(error.response?.data?.error || 'Failed to load users')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const createUser = async (userData) => {
//     setLoading(true)
//     try {
//       const result = await apiService.createUser(userData)
//       if (result.success) {
//         await loadUsers() // Reload users
//         setError('')
//         return result
//       }
//     } catch (error) {
//       const errorMsg = error.response?.data?.error || 'Failed to create user'
//       setError(errorMsg)
//       throw error
//     } finally {
//       setLoading(false)
//     }
//   }

//   return {
//     users,
//     loading,
//     error,
//     createUser,
//     refetch: loadUsers
//   }
// }


// hooks/useExam.js
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