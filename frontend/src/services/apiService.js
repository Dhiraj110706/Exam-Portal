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

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const apiService = {
  // Authentication
  async login(username, password) {
    const response = await apiClient.post('/login/', { username, password })
    return response.data
  },

  async logout() {
    const response = await apiClient.post('/logout/')
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
