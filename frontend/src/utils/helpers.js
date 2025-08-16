// utils/helpers.js

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min${minutes !== 1 ? 's' : ''}`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}m`
}

export const getScoreColor = (score) => {
  if (score >= 90) return 'text-green-600'
  if (score >= 70) return 'text-yellow-600'
  return 'text-red-600'
}

export const getScoreBadgeColor = (score) => {
  if (score >= 90) return 'bg-green-100 text-green-800'
  if (score >= 70) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

export const calculatePercentage = (value, total) => {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const generateCSV = (data, headers) => {
  const csvHeaders = headers.join(',')
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header]
      // Handle values that might contain commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    }).join(',')
  )
  
  return [csvHeaders, ...csvRows].join('\n')
}

export const downloadCSV = (data, filename = 'data.csv') => {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Validation utilities
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 6
}

export const validateUsername = (username) => {
  const re = /^[a-zA-Z0-9_]+$/
  return re.test(username) && username.length >= 3
}

// Local storage utilities with error handling
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Error writing to localStorage:', error)
      return false
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error removing from localStorage:', error)
      return false
    }
  }
}

// URL utilities
export const getQueryParam = (param) => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(param)
}

export const setQueryParam = (param, value) => {
  const url = new URL(window.location)
  url.searchParams.set(param, value)
  window.history.replaceState({}, '', url)
}

// Anti-cheating utilities
export const detectDevTools = () => {
  let devtools = { open: false }
  
  const threshold = 160
  
  setInterval(() => {
    if (window.outerHeight - window.innerHeight > threshold || 
        window.outerWidth - window.innerWidth > threshold) {
      if (!devtools.open) {
        devtools.open = true
        window.dispatchEvent(new CustomEvent('devtoolsopen'))
      }
    } else {
      if (devtools.open) {
        devtools.open = false
        window.dispatchEvent(new CustomEvent('devtoolsclose'))
      }
    }
  }, 500)
  
  return devtools
}

export const preventCopyPaste = () => {
  document.addEventListener('copy', (e) => e.preventDefault())
  document.addEventListener('paste', (e) => e.preventDefault())
  document.addEventListener('cut', (e) => e.preventDefault())
  document.addEventListener('selectstart', (e) => e.preventDefault())
}

export const enableCopyPaste = () => {
  document.removeEventListener('copy', (e) => e.preventDefault())
  document.removeEventListener('paste', (e) => e.preventDefault())
  document.removeEventListener('cut', (e) => e.preventDefault())
  document.removeEventListener('selectstart', (e) => e.preventDefault())
}

export const preventRightClick = () => {
  document.addEventListener('contextmenu', (e) => e.preventDefault())
}

export const enableRightClick = () => {
  document.removeEventListener('contextmenu', (e) => e.preventDefault())
}

// Error handling utilities
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.message || `Error ${error.response.status}: ${error.response.statusText}`
  } else if (error.request) {
    // Request was made but no response
    return 'Network error: Please check your internet connection'
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred'
  }
}

// Array utilities
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key]
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {})
}

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (direction === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
    }
  })
}

export const unique = (array, key) => {
  if (key) {
    const seen = new Set()
    return array.filter(item => {
      const value = item[key]
      if (seen.has(value)) {
        return false
      }
      seen.add(value)
      return true
    })
  }
  return [...new Set(array)]
}

// Constants
export const EXAM_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  COMPLETED: 'completed'
}

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  STUDENT: 'STUDENT'
}

export const VIOLATION_TYPES = {
  TAB_SWITCH: 'Tab switched or window minimized',
  FACE_NOT_DETECTED: 'Face not detected in camera',
  RIGHT_CLICK: 'Right-click attempted',
  DEV_TOOLS: 'Developer tools access attempted',
  COPY_PASTE: 'Copy/paste attempted',
  MULTIPLE_FACES: 'Multiple faces detected',
  CAMERA_BLOCKED: 'Camera was blocked or covered'
}