import React, { useState, useEffect } from 'react'
import { Users, BookOpen, FileText, TrendingUp } from 'lucide-react'
import Card from '@components/common/Card'
import { apiService } from '@services/apiService'

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalExams: 0,
    totalQuestions: 0,
    averageScore: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [students, exams, questions] = await Promise.all([
        apiService.getStudents(),
        apiService.getExams(),
        apiService.getQuestions()
      ])

      setStats({
        totalStudents: students.length,
        totalExams: exams.length,
        totalQuestions: questions.length,
        averageScore: 85 // Placeholder
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Active Exams',
      value: stats.totalExams,
      icon: FileText,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Question Bank',
      value: stats.totalQuestions,
      icon: BookOpen,
      color: 'bg-purple-500',
      change: '+15%'
    },
    {
      title: 'Average Score',
      value: `${stats.averageScore}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+3%'
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-24 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change} from last month</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
              <BookOpen className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Create New Exam</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
              <Users className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Add Students</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
              <FileText className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Upload Questions</p>
            </button>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'New student registered', user: 'John Doe', time: '2 hours ago' },
              { action: 'Exam completed', user: 'Jane Smith', time: '4 hours ago' },
              { action: 'Questions uploaded', user: 'Admin', time: '1 day ago' },
              { action: 'New exam created', user: 'Admin', time: '2 days ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">by {activity.user}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default DashboardOverview
