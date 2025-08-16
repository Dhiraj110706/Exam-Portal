import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiService } from '@services/apiService'
import { useAuth } from '@contexts/AuthContext'
import LoadingSpinner from '@components/common/LoadingSpinner'
import ExamSetup from '@components/student/ExamSetup'
import ExamInterface from '@components/student/ExamInterface'

const ExamPage = () => {
  const { examId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [exam, setExam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [examStarted, setExamStarted] = useState(false)

  useEffect(() => {
    loadExam()
  }, [examId])

  const loadExam = async () => {
    try {
      const examData = await apiService.getExamDetails(examId)
      setExam(examData)
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to load exam'
      setError(errorMsg)
      
      if (error.response?.status === 400 && errorMsg.includes('already taken')) {
        // Exam already taken, redirect after showing message
        setTimeout(() => navigate('/'), 3000)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleStartExam = async () => {
    try {
      // Request fullscreen
      await document.documentElement.requestFullscreen()
      setExamStarted(true)
    } catch (error) {
      alert('Fullscreen mode is required to start the exam')
    }
  }

  const handleExamComplete = () => {
    // Exit fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen()
    }
    navigate('/')
  }

  if (loading) {
    return <LoadingSpinner message="Loading exam..." />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Exam Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!examStarted) {
    return (
      <ExamSetup
        exam={exam}
        user={user}
        onStartExam={handleStartExam}
        onBack={() => navigate('/')}
      />
    )
  }

  return (
    <ExamInterface
      exam={exam}
      user={user}
      onExamComplete={handleExamComplete}
    />
  )
}

export default ExamPage

