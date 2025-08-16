import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

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
      const response = await apiClient.get('/csrf-token/')
      csrfToken = response.data.csrf_token
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
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Update CSRF token if provided in response
    if (response.data.csrf_token) {
      csrfToken = response.data.csrf_token
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      csrfToken = null // Reset CSRF token
      window.location.href = '/login'
    } else if (error.response?.status === 403 && error.response?.data?.detail?.includes('CSRF')) {
      // CSRF token expired or invalid, try to refresh it
      csrfToken = null
      return getCSRFToken().then(() => {
        // Retry the original request
        return apiClient.request(error.config)
      })
    }
    return Promise.reject(error)
  }
)

export const apiService = {
  // Initialize CSRF token
  async initCSRF() {
    await getCSRFToken()
  },

  // Authentication
  async login(username, password) {
    // Ensure we have a CSRF token before login
    await this.initCSRF()
    const response = await apiClient.post('/login/', { username, password })
    return response.data
  },

  async logout() {
    const response = await apiClient.post('/logout/')
    csrfToken = null // Clear CSRF token after logout
    return response.data
  },

  async getCurrentUser() {
    const response = await apiClient.get('/current-user/')
    return response.data
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