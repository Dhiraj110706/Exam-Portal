import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

console.log('API Base URL:', API_BASE_URL)

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
})

// CSRF token management
let csrfToken = null

const getCSRFToken = async () => {
  if (!csrfToken) {
    try {
      console.log('Fetching CSRF token...')
      const response = await apiClient.get('/csrf-token/')
      csrfToken = response.data.csrf_token
      console.log('CSRF token obtained')
    } catch (error) {
      console.error('Failed to get CSRF token:', error)
    }
  }
  return csrfToken
}

// Get CSRF token from cookies (fallback)
const getCSRFTokenFromCookie = () => {
  const name = 'csrftoken'
  let cookieValue = null
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue
}

// Request interceptor to add CSRF token
apiClient.interceptors.request.use(
  async (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.url}`)
    
    // Add CSRF token for POST, PUT, PATCH, DELETE requests
    if (['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
      let token = csrfToken || getCSRFTokenFromCookie()
      
      if (!token) {
        token = await getCSRFToken()
      }
      
      if (token) {
        config.headers['X-CSRFToken'] = token
      }
    }
    
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status)
    
    // Update CSRF token if provided in response
    if (response.data.csrf_token) {
      csrfToken = response.data.csrf_token
    }
    return response
  },
  async (error) => {
    console.error('Response error:', error.response?.status, error.response?.data)
    
    if (error.response?.status === 401) {
      console.log('Unauthorized - redirecting to login')
      csrfToken = null
      // Don't redirect here, let the AuthContext handle it
      return Promise.reject(error)
    } else if (error.response?.status === 403) {
      console.log('Forbidden - might be CSRF issue')
      // Try to refresh CSRF token for 403 errors
      csrfToken = null
      try {
        await getCSRFToken()
        // Retry the original request
        return apiClient.request(error.config)
      } catch (csrfError) {
        console.error('Failed to refresh CSRF token:', csrfError)
        return Promise.reject(error)
      }
    }
    
    return Promise.reject(error)
  }
)

export const apiService = {
  // Initialize CSRF token
  async initCSRF() {
    try {
      await getCSRFToken()
    } catch (error) {
      console.warn('Failed to initialize CSRF token:', error)
    }
  },

  // Authentication
  async login(username, password) {
    console.log('API: Attempting login...')
    try {
      // Ensure we have a CSRF token before login
      await this.initCSRF()
      const response = await apiClient.post('/login/', { username, password })
      console.log('API: Login response:', response.data)
      return response.data
    } catch (error) {
      console.error('API: Login failed:', error)
      throw error
    }
  },

  async logout() {
    console.log('API: Attempting logout...')
    try {
      const response = await apiClient.post('/logout/')
      csrfToken = null // Clear CSRF token after logout
      console.log('API: Logout successful')
      return response.data
    } catch (error) {
      console.error('API: Logout failed:', error)
      throw error
    }
  },

  async getCurrentUser() {
    try {
      const response = await apiClient.get('/current-user/')
      return response.data
    } catch (error) {
      console.log('API: Current user check failed')
      throw error
    }
  },

  // Dashboard Statistics - NEW OPTIMIZED ENDPOINT
  async getDashboardStats() {
    try {
      console.log('API: Fetching dashboard statistics...')
      const response = await apiClient.get('/dashboard-stats/')
      console.log('API: Dashboard stats fetched:', response.data)
      return response.data
    } catch (error) {
      console.error('API: Dashboard stats error:', error)
      
      // Fallback to individual API calls if the dashboard endpoint fails
      console.log('API: Falling back to individual API calls...')
      try {
        const [students, exams, questions, results] = await Promise.all([
          this.getStudents(),
          this.getExams(),
          this.getQuestions(),
          this.getResults(),
        ])

        // Calculate average score
        const totalScore = results.reduce((sum, result) => sum + (result.score || 0), 0)
        const averageScore = results.length > 0 ? parseFloat((totalScore / results.length).toFixed(1)) : 0

        // Calculate additional stats
        const flaggedSubmissions = results.filter(r => r.cheated).length
        const activeExams = exams.filter(e => e.is_active).length

        return {
          totalStudents: students.length,
          totalExams: exams.length,
          activeExams: activeExams,
          totalQuestions: questions.length,
          averageScore: averageScore,
          totalResults: results.length,
          flaggedSubmissions: flaggedSubmissions,
          recentResults: results.slice(0, 10), // Get 10 most recent results
          performanceTrends: {
            excellent: results.filter(r => r.score >= 90).length,
            good: results.filter(r => r.score >= 70 && r.score < 90).length,
            average: results.filter(r => r.score >= 50 && r.score < 70).length,
            poor: results.filter(r => r.score < 50).length
          },
          summary: {
            completion_rate: students.length > 0 ? parseFloat(((results.length / students.length) * 100).toFixed(1)) : 0,
            pass_rate: results.length > 0 ? parseFloat(((results.filter(r => r.score >= 50).length / results.length) * 100).toFixed(1)) : 0,
            cheat_rate: results.length > 0 ? parseFloat(((flaggedSubmissions / results.length) * 100).toFixed(1)) : 0
          }
        }
      } catch (fallbackError) {
        console.error('API: Fallback dashboard stats also failed:', fallbackError)
        throw fallbackError
      }
    }
  },

  // Questions Management
  async uploadCSV(file) {
    try {
      console.log('API: Uploading CSV file...')
      const formData = new FormData()
      formData.append('file', file)
      const response = await apiClient.post('/upload-csv/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      console.log('API: CSV upload successful:', response.data)
      return response.data
    } catch (error) {
      console.error('API: CSV upload error:', error)
      throw error
    }
  },

  async getQuestions() {
    try {
      console.log('API: Fetching questions...')
      const response = await apiClient.get('/questions/')
      console.log('API: Questions fetched:', response.data?.length || 0, 'questions')
      return response.data
    } catch (error) {
      console.error('API: Get questions error:', error)
      throw error
    }
  },

  async createQuestion(questionData) {
    try {
      console.log('API: Creating question...')
      const response = await apiClient.post('/questions/', questionData)
      console.log('API: Question created:', response.data)
      return response.data
    } catch (error) {
      console.error('API: Create question error:', error)
      throw error
    }
  },

  async updateQuestion(questionId, questionData) {
    try {
      console.log('API: Updating question:', questionId)
      const response = await apiClient.put(`/questions/${questionId}/`, questionData)
      console.log('API: Question updated:', response.data)
      return response.data
    } catch (error) {
      console.error('API: Update question error:', error)
      throw error
    }
  },

  async deleteQuestion(questionId) {
    try {
      console.log('API: Deleting question:', questionId)
      const response = await apiClient.delete(`/questions/${questionId}/`)
      console.log('API: Question deleted')
      return response.data
    } catch (error) {
      console.error('API: Delete question error:', error)
      throw error
    }
  },

  // Exams Management
  async createExam(examData) {
    try {
      console.log('API: Creating exam with data:', examData)
      
      // Ensure the data is in the correct format
      const formattedData = {
        title: examData.title,
        description: examData.description || '',
        duration_minutes: parseInt(examData.duration_minutes) || 60,
        max_violations: parseInt(examData.max_violations) || 3,
        is_active: examData.is_active !== undefined ? examData.is_active : true,
        question_ids: examData.question_ids || []
      }
      
      console.log('API: Formatted exam data:', formattedData)
      
      const response = await apiClient.post('/create-exam/', formattedData)
      console.log('API: Exam creation response:', response.data)
      
      return response.data
    } catch (error) {
      console.error('API: Create exam error:', error)
      console.error('API: Error response:', error.response?.data)
      throw error
    }
  },

  async getExams() {
    try {
      console.log('API: Fetching exams...')
      const response = await apiClient.get('/exams/')
      console.log('API: Exams fetched:', response.data?.length || 0, 'exams')
      return response.data
    } catch (error) {
      console.error('API: Get exams error:', error)
      throw error
    }
  },

  async getExamDetails(examId) {
    try {
      console.log('API: Fetching exam details for:', examId)
      const response = await apiClient.get(`/exams/${examId}/`)
      console.log('API: Exam details fetched:', response.data)
      return response.data
    } catch (error) {
      console.error('API: Get exam details error:', error)
      throw error
    }
  },

  async updateExam(examId, examData) {
    try {
      console.log('API: Updating exam:', examId)
      const response = await apiClient.put(`/exams/${examId}/`, examData)
      console.log('API: Exam updated:', response.data)
      return response.data
    } catch (error) {
      console.error('API: Update exam error:', error)
      throw error
    }
  },

  async deleteExam(examId) {
    try {
      console.log('API: Deleting exam:', examId)
      const response = await apiClient.delete(`/exams/${examId}/`)
      console.log('API: Exam deleted')
      return response.data
    } catch (error) {
      console.error('API: Delete exam error:', error)
      throw error
    }
  },

  async toggleExamStatus(examId, isActive) {
    try {
      console.log('API: Toggling exam status:', examId, 'to', isActive)
      const response = await apiClient.patch(`/exams/${examId}/`, { is_active: isActive })
      console.log('API: Exam status updated:', response.data)
      return response.data
    } catch (error) {
      console.error('API: Toggle exam status error:', error)
      throw error
    }
  },

  async submitExam(examId, examData) {
    try {
      console.log('API: Submitting exam:', examId, 'with data:', examData)
      const response = await apiClient.post(`/exams/${examId}/submit/`, examData)
      console.log('API: Exam submitted:', response.data)
      return response.data
    } catch (error) {
      console.error('API: Submit exam error:', error)
      throw error
    }
  },

  // User Management
  async createUser(userData) {
    try {
      console.log('API: Creating user with data:', { ...userData, password: '[HIDDEN]' })
      const response = await apiClient.post('/create-user/', userData)
      console.log('API: User created:', response.data)
      return response.data
    } catch (error) {
      console.error('API: Create user error:', error)
      throw error
    }
  },

  async getUsers() {
    try {
      console.log('API: Fetching all users...')
      const response = await apiClient.get('/users/')
      console.log('API: Users fetched:', response.data?.length || 0, 'users')
      return response.data
    } catch (error) {
      console.error('API: Get users error:', error)
      throw error
    }
  },

  async getStudents() {
    try {
      console.log('API: Fetching students...')
      const response = await apiClient.get('/students/')
      console.log('API: Students fetched:', response.data?.length || 0, 'students')
      return response.data
    } catch (error) {
      console.error('API: Get students error:', error)
      throw error
    }
  },

  async getUserDetails(userId) {
    try {
      console.log('API: Fetching user details for:', userId)
      const response = await apiClient.get(`/users/${userId}/`)
      console.log('API: User details fetched:', response.data)
      return response.data
    } catch (error) {
      console.error('API: Get user details error:', error)
      throw error
    }
  },

  async updateUser(userId, userData) {
    try {
      console.log('API: Updating user:', userId)
      const response = await apiClient.put(`/users/${userId}/`, userData)
      console.log('API: User updated:', response.data)
      return response.data
    } catch (error) {
      console.error('API: Update user error:', error)
      throw error
    }
  },

  // async deleteUser(userId) {
  //   try {
  //     console.log('API: Deleting user:', userId)
  //     const response = await apiClient.delete(`/users/${userId}/`)
  //     console.log('API: User deleted')
  //     return response.data
  //   } catch (error) {
  //     console.error('API: Delete user error:', error)
  //     throw error
  //   }
  // }
  // Update this method in your frontend/src/services/apiService.js

async deleteUser(userId) {
  try {
    console.log('API: Deleting user:', userId)
    // Fixed: Changed from /users/${userId}/ to /users/${userId}/delete/
    const response = await apiClient.delete(`/users/${userId}/delete/`)
    console.log('API: User deleted')
    return response.data
  } catch (error) {
    console.error('API: Delete user error:', error)
    throw error
  }
}
  ,

  async bulkImportStudents(file) {
    try {
      console.log('API: Bulk importing students...')
      const formData = new FormData()
      formData.append('file', file)
      const response = await apiClient.post('/bulk-import-students/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      console.log('API: Bulk import successful:', response.data)
      return response.data
    } catch (error) {
      console.error('API: Bulk import error:', error)
      throw error
    }
  },

  async resetPassword(userId, newPassword) {
    try {
      console.log('API: Resetting password for user:', userId)
      const response = await apiClient.post(`/users/${userId}/reset-password/`, {
        password: newPassword
      })
      console.log('API: Password reset successful')
      return response.data
    } catch (error) {
      console.error('API: Reset password error:', error)
      throw error
    }
  },

  // Results and Analytics
  async getResults() {
    try {
      console.log('API: Fetching all results...')
      const response = await apiClient.get('/results/')
      console.log('API: Results fetched:', response.data?.length || 0, 'results')
      return response.data
    } catch (error) {
      console.error('API: Get results error:', error)
      throw error
    }
  },

  async getExamResults(examId) {
    try {
      console.log('API: Fetching results for exam:', examId)
      const response = await apiClient.get(`/exams/${examId}/results/`)
      console.log('API: Exam results fetched:', response.data?.length || 0, 'results')
      return response.data
    } catch (error) {
      console.error('API: Get exam results error:', error)
      throw error
    }
  },

  async getStudentResults(studentId) {
    try {
      console.log('API: Fetching results for student:', studentId)
      const response = await apiClient.get(`/students/${studentId}/results/`)
      console.log('API: Student results fetched:', response.data?.length || 0, 'results')
      return response.data
    } catch (error) {
      console.error('API: Get student results error:', error)
      throw error
    }
  },

  async getResultDetails(resultId) {
    try {
      console.log('API: Fetching result details for:', resultId)
      const response = await apiClient.get(`/results/${resultId}/`)
      console.log('API: Result details fetched:', response.data)
      return response.data
    } catch (error) {
      console.error('API: Get result details error:', error)
      throw error
    }
  },

  async getAnalytics() {
    try {
      console.log('API: Fetching analytics...')
      const response = await apiClient.get('/analytics/')
      console.log('API: Analytics fetched:', response.data)
      return response.data
    } catch (error) {
      console.error('API: Get analytics error:', error)
      throw error
    }
  },

  async getExamAnalytics(examId) {
    try {
      console.log('API: Fetching analytics for exam:', examId)
      const response = await apiClient.get(`/exams/${examId}/analytics/`)
      console.log('API: Exam analytics fetched:', response.data)
      return response.data
    } catch (error) {
      console.error('API: Get exam analytics error:', error)
      throw error
    }
  },

  async exportResults(examId = null, format = 'csv') {
    try {
      console.log('API: Exporting results...', { examId, format })
      const url = examId ? `/exams/${examId}/export/` : '/results/export/'
      const response = await apiClient.get(url, {
        params: { format },
        responseType: 'blob'
      })
      console.log('API: Results exported successfully')
      return response.data
    } catch (error) {
      console.error('API: Export results error:', error)
      throw error
    }
  },

  // Student-specific endpoints
  async getAvailableExams() {
    try {
      console.log('API: Fetching available exams for student...')
      const response = await apiClient.get('/student/exams/')
      console.log('API: Available exams fetched:', response.data?.length || 0, 'exams')
      return response.data
    } catch (error) {
      console.error('API: Get available exams error:', error)
      throw error
    }
  },

  async getStudentExamHistory() {
    try {
      console.log('API: Fetching student exam history...')
      const response = await apiClient.get('/student/history/')
      console.log('API: Exam history fetched:', response.data?.length || 0, 'exams')
      return response.data
    } catch (error) {
      console.error('API: Get exam history error:', error)
      throw error
    }
  },

  async startExam(examId) {
    try {
      console.log('API: Starting exam:', examId)
      const response = await apiClient.post(`/exams/${examId}/start/`)
      console.log('API: Exam started:', response.data)
      return response.data
    } catch (error) {
      console.error('API: Start exam error:', error)
      throw error
    }
  },

  // Violation tracking (for exam monitoring)
  async reportViolation(examId, violationType, details = {}) {
    try {
      console.log('API: Reporting violation:', { examId, violationType, details })
      const response = await apiClient.post(`/exams/${examId}/violation/`, {
        type: violationType,
        details: details,
        timestamp: new Date().toISOString()
      })
      console.log('API: Violation reported:', response.data)
      return response.data
    } catch (error) {
      console.error('API: Report violation error:', error)
      throw error
    }
  },

  // Utility methods
  async checkServerHealth() {
    try {
      console.log('API: Checking server health...')
      const response = await apiClient.get('/health/')
      console.log('API: Server health:', response.data)
      return response.data
    } catch (error) {
      console.error('API: Health check error:', error)
      throw error
    }
  },

  // Clear cached data
  clearCache() {
    console.log('API: Clearing cache...')
    csrfToken = null
  },

  // Get current API configuration
  getConfig() {
    return {
      baseURL: API_BASE_URL,
      hasCSRFToken: !!csrfToken,
      tokenSource: csrfToken ? 'api' : (getCSRFTokenFromCookie() ? 'cookie' : 'none')
    }
  },

  // Test API connectivity
  async testConnection() {
    try {
      console.log('API: Testing connection...')
      const response = await apiClient.get('/csrf-token/', { timeout: 5000 })
      console.log('API: Connection test successful')
      return { success: true, data: response.data }
    } catch (error) {
      console.error('API: Connection test failed:', error)
      return { 
        success: false, 
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      }
    }
  }
}