import React, { useState, useEffect } from 'react'
import { Edit, Trash2, Users } from 'lucide-react'
import Card from '@components/common/Card'
import Button from '@components/common/Button'
import { apiService } from '@services/apiService'
import { formatDate } from '@utils/helpers'

const ExamsList = () => {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    )
  }

  if (exams.length === 0) {
    return (
      <Card className="text-center py-12">
        <p className="text-gray-500 mb-4">No exams created yet</p>
        <p className="text-sm text-gray-400">
          Select questions and create your first exam
        </p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exams.map((exam) => (
        <Card key={exam.id} hover className="relative">
          <div className="p-6">
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                exam.is_active 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {exam.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Exam Info */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-16">
                {exam.title}
              </h3>
              {exam.description && (
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {exam.description}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Questions:</span>
                <span className="ml-1">{exam.questions_count}</span>
              </div>
              <div>
                <span className="font-medium">Duration:</span>
                <span className="ml-1">{exam.duration_minutes} min</span>
              </div>
              <div>
                <span className="font-medium">Max Violations:</span>
                <span className="ml-1">{exam.max_violations}</span>
              </div>
              <div>
                <span className="font-medium">Created:</span>
                <span className="ml-1">{formatDate(exam.created_at)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-500">
                <Users className="w-4 h-4 mr-1" />
                0 submissions
              </div>
              <div className="flex space-x-2">
                <Button size="small" variant="outline">
                  <Edit className="w-3 h-3" />
                </Button>
                <Button size="small" variant="outline">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default ExamsList
