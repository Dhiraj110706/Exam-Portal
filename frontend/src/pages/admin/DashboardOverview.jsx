import React, { useState, useEffect } from 'react'
import { Users, BookOpen, FileText, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react'
import Card from '@components/common/Card'
import  LoadingSpinner  from '@components/common/Toast'
import { useToast } from '@components/common/Toast'
import { apiService } from '@services/apiService'

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalExams: 0,
    activeExams: 0,
    totalQuestions: 0,
    averageScore: 0,
    totalResults: 0,
    flaggedSubmissions: 0,
    recentResults: [],
    performanceTrends: {
      excellent: 0,
      good: 0,
      average: 0,
      poor: 0
    },
    summary: {
      completion_rate: 0,
      pass_rate: 0,
      cheat_rate: 0
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const statsData = await apiService.getDashboardStats()
      setStats(statsData)
      
    } catch (error) {
      console.error('Failed to load stats:', error)
      const errorMessage = error.response?.data?.error || 'Failed to load dashboard statistics. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
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
      change: stats.totalStudents > 0 ? '+12%' : '0%',
      description: 'Registered students'
    },
    {
      title: 'Active Exams',
      value: stats.activeExams || stats.totalExams,
      icon: FileText,
      color: 'bg-green-500',
      change: stats.totalExams > 0 ? '+8%' : '0%',
      description: 'Published exams'
    },
    {
      title: 'Question Bank',
      value: stats.totalQuestions,
      icon: BookOpen,
      color: 'bg-purple-500',
      change: stats.totalQuestions > 0 ? '+15%' : '0%',
      description: 'Available questions'
    },
    {
      title: 'Average Score',
      value: `${stats.averageScore}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: stats.averageScore > 0 ? '+3%' : '0%',
      description: 'Overall performance'
    }
  ]

  const formatRecentActivity = (results) => {
    return results.slice(0, 4).map((result) => ({
      action: `Exam "${result.exam?.title || 'Unknown'}" completed`,
      user: `${result.student?.first_name || ''} ${result.student?.last_name || ''}`.trim() || result.student?.username || 'Unknown',
      score: result.score,
      time: new Date(result.submitted_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      cheated: result.cheated
    }))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <LoadingSpinner size="lg" text="Loading dashboard data..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={loadStats}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="card-hover">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${
                      parseFloat(stat.change) > 0 ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {stat.change} from last month
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary Card */}
      {stats.totalResults > 0 && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{stats.totalResults}</p>
                <p className="text-sm text-gray-600">Total Submissions</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{stats.summary.pass_rate}%</p>
                <p className="text-sm text-gray-600">Pass Rate</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {stats.flaggedSubmissions}
                </p>
                <p className="text-sm text-gray-600">Flagged Submissions</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => window.location.href = '/admin/questions'}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <BookOpen className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Create New Exam</p>
              <p className="text-xs text-gray-500">Set up a new exam with questions</p>
            </button>
            <button 
              onClick={() => window.location.href = '/admin/users'}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <Users className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Add Students</p>
              <p className="text-xs text-gray-500">Register new students</p>
            </button>
            <button 
              onClick={() => window.location.href = '/admin/questions'}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <FileText className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Upload Questions</p>
              <p className="text-xs text-gray-500">Import questions from CSV</p>
            </button>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button 
              onClick={() => window.location.href = '/admin/results'}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              View All Results
            </button>
          </div>
          
          {stats.recentResults && stats.recentResults.length > 0 ? (
            <div className="space-y-4">
              {formatRecentActivity(stats.recentResults).map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      {activity.cheated && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Flagged
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">by {activity.user}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{activity.score}%</p>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No exam submissions yet</p>
              <p className="text-sm">Students haven't taken any exams</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default DashboardOverview