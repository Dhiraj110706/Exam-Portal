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

  // Questions
  async uploadCSV(file) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post('/upload-csv/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  async getQuestions() {
    const response = await apiClient.get('/questions/')
    return response.data
  },

  // Exams
  async createExam(examData) {
    const response = await apiClient.post('/create-exam/', examData)
    return response.data
  },

  async getExams() {
    const response = await apiClient.get('/exams/')
    return response.data
  },

  async getExamDetails(examId) {
    const response = await apiClient.get(`/exams/${examId}/`)
    return response.data
  },

  async submitExam(examId, data) {
    const response = await apiClient.post(`/exams/${examId}/submit/`, data)
    return response.data
  },

  // User Management
  async createUser(userData) {
    const response = await apiClient.post('/create-user/', userData)
    return response.data
  },

  async bulkImportStudents(file) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post('/bulk-import-students/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  async getStudents() {
    const response = await apiClient.get('/students/')
    return response.data
  },

  // Results
  async getExamResults(examId) {
    const response = await apiClient.get(`/exams/${examId}/results/`)
    return response.data
  }
}