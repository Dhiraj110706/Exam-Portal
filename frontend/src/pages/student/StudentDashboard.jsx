import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { BookOpen, Clock, Trophy, AlertTriangle } from 'lucide-react'
import Card from '@components/common/Card'
import Button from '@components/common/Button'
import Header from '@components/layout/Header'
import { apiService } from '@services/apiService'
import { formatDate } from '@utils/helpers'

const StudentDashboard = () => {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadExams()
  }, [])

  const loadExams = async () => {
    try {
      const data = await apiService.getExams()
      setExams(data)
    } catch (error) {
      console.error('Failed to load exams:', error)
    } finally {
      setLoading(false)
    }
  }

  const startExam = (examId) => {
    navigate(`/exam/${examId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Student Dashboard" 
        subtitle="Take your exams and view results"
      />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Section */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Welcome Back!</h2>
                  <p className="text-gray-600 mt-1">Ready to take your exams?</p>
                </div>
                <div className="flex items-center space-x-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary-600">{exams.length}</div>
                    <div className="text-sm text-gray-500">Available Exams</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Security Notice */}
          <Card className="border-l-4 border-red-500">
            <div className="p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-red-500 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900">Security Notice</h3>
                  <div className="text-red-800 text-sm mt-2 space-y-1">
                    <p>• Exams are monitored for cheating attempts</p>
                    <p>• Camera access required for face detection</p>
                    <p>• Fullscreen mode will be enforced during exams</p>
                    <p>• Tab switching and copy-paste are disabled</p>
                    <p>• Maximum violations will result in auto-submission</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Available Exams */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Exams</h3>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded"></div>
                  </Card>
                ))}
              </div>
            ) : exams.length === 0 ? (
              <Card className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No Exams Available</p>
                <p className="text-gray-400">Check back later for new exams</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map((exam) => (
                  <ExamCard
                    key={exam.id}
                    exam={exam}
                    onStartExam={() => startExam(exam.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Exam Card Component
const ExamCard = ({ exam, onStartExam }) => {
  return (
    <Card hover className="relative overflow-hidden">
      <div className="p-6">
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            exam.is_active 
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {exam.is_active ? 'Available' : 'Inactive'}
          </span>
        </div>

        {/* Exam Info */}
        <div className="mb-4 pr-16">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {exam.title}
          </h3>
          {exam.description && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {exam.description}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            <span>{exam.questions_count} Questions</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>{exam.duration_minutes} Minutes</span>
          </div>
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            <span>Max {exam.max_violations} Violations</span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={onStartExam}
          disabled={!exam.is_active}
          className="w-full"
        >
          {exam.is_active ? 'Start Exam' : 'Exam Inactive'}
        </Button>
      </div>
    </Card>
  )
}

export default StudentDashboard