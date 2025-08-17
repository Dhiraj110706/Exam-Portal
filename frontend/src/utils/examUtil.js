// src/utils/examUtils.js

import { 
  VIOLATION_TYPES, 
  VIOLATION_CONFIG, 
  TIME_CONFIG, 
  NOTIFICATION_MESSAGES 
} from './constants'

/**
 * Format time in seconds to MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds) => {
  if (seconds < 0) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return 'N/A'
  try {
    return new Date(date).toLocaleString()
  } catch (error) {
    return 'Invalid Date'
  }
}

/**
 * Calculate score percentage
 * @param {number} correct - Number of correct answers
 * @param {number} total - Total number of questions
 * @returns {number} Score percentage
 */
export const calculateScore = (correct, total) => {
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}

/**
 * Get violation level based on count and max violations
 * @param {number} violationCount - Current violation count
 * @param {number} maxViolations - Maximum allowed violations
 * @returns {string} Violation level (none, low, high, critical)
 */
export const getViolationLevel = (violationCount, maxViolations) => {
  if (violationCount === 0) return 'none'
  if (violationCount < Math.ceil(maxViolations * 0.5)) return 'low'
  if (violationCount < maxViolations) return 'high'
  return 'critical'
}

/**
 * Get time warning level based on remaining time
 * @param {number} timeLeft - Time left in seconds
 * @param {number} totalTime - Total exam time in seconds
 * @returns {string} Time warning level (normal, warning, critical)
 */
export const getTimeWarningLevel = (timeLeft, totalTime) => {
  const percentage = (timeLeft / totalTime) * 100
  if (percentage > 25) return 'normal'
  if (percentage > 10) return 'warning'
  return 'critical'
}

/**
 * Validate exam submission data
 * @param {Object} submissionData - Exam submission data
 * @returns {Object} Validation result with isValid and errors
 */
export const validateSubmission = (submissionData) => {
  const errors = []
  
  if (!submissionData.answers || typeof submissionData.answers !== 'object') {
    errors.push('Invalid answers format')
  }
  
  if (typeof submissionData.time_taken !== 'number' || submissionData.time_taken < 0) {
    errors.push('Invalid time taken')
  }
  
  if (!submissionData.started_at) {
    errors.push('Missing start time')
  }
  
  if (!Array.isArray(submissionData.violations_log)) {
    errors.push('Invalid violations log format')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Check if exam can be started
 * @param {Object} exam - Exam object
 * @param {Object} user - User object
 * @returns {Object} Check result with canStart and reason
 */
export const canStartExam = (exam, user) => {
  if (!exam) {
    return { canStart: false, reason: 'Exam not found' }
  }
  
  if (!exam.is_active) {
    return { canStart: false, reason: 'Exam is not active' }
  }
  
  if (user.role !== 'STUDENT') {
    return { canStart: false, reason: 'Only students can take exams' }
  }
  
  if (!exam.questions || exam.questions.length === 0) {
    return { canStart: false, reason: 'No questions available in this exam' }
  }
  
  return { canStart: true, reason: 'Exam can be started' }
}

/**
 * Generate violation report
 * @param {Array} violations - Array of violation objects
 * @returns {Object} Violation report with counts and summary
 */
export const generateViolationReport = (violations) => {
  const report = {
    total: violations.length,
    byType: {},
    timeline: [],
    severity: 'low'
  }
  
  violations.forEach(violation => {
    // Count by type
    if (report.byType[violation.type]) {
      report.byType[violation.type]++
    } else {
      report.byType[violation.type] = 1
    }
    
    // Add to timeline
    report.timeline.push({
      timestamp: violation.timestamp,
      type: violation.type,
      message: violation.message
    })
  })
  
  // Determine severity
  if (violations.length === 0) {
    report.severity = 'none'
  } else if (violations.length <= 2) {
    report.severity = 'low'
  } else if (violations.length <= 5) {
    report.severity = 'medium'
  } else {
    report.severity = 'high'
  }
  
  return report
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, delay) => {
  let lastCall = 0
  return (...args) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      return func.apply(null, args)
    }
  }
}

/**
 * Check if browser supports required features
 * @returns {Object} Support check results
 */
export const checkBrowserSupport = () => {
  const support = {
    fullscreen: !!(
      document.documentElement.requestFullscreen ||
      document.documentElement.webkitRequestFullscreen ||
      document.documentElement.mozRequestFullScreen ||
      document.documentElement.msRequestFullscreen
    ),
    camera: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    notifications: 'Notification' in window,
    localStorage: 'localStorage' in window,
    sessionStorage: 'sessionStorage' in window
  }
  
  const unsupported = Object.keys(support).filter(key => !support[key])
  
  return {
    ...support,
    allSupported: unsupported.length === 0,
    unsupported
  }
}

/**
 * Request necessary permissions
 * @returns {Promise<Object>} Permission status
 */
export const requestPermissions = async () => {
  const permissions = {
    camera: false,
    notifications: false
  }
  
  try {
    // Request camera permission
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    permissions.camera = true
    stream.getTracks().forEach(track => track.stop()) // Clean up
  } catch (error) {
    console.warn('Camera permission denied:', error)
  }
  
  try {
    // Request notification permission
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      permissions.notifications = permission === 'granted'
    }
  } catch (error) {
    console.warn('Notification permission denied:', error)
  }
  
  return permissions
}

/**
 * Show browser notification
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {Object} options - Additional notification options
 */
export const showNotification = (title, body, options = {}) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      ...options
    })
  } else {
    // Fallback to console log for development
    console.log(`Notification: ${title} - ${body}`)
  }
}

/**
 * Generate random exam ID
 * @returns {string} Random exam ID
 */
export const generateExamId = () => {
  return `exam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Sanitize user input
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return ''
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
               .replace(/javascript:/gi, '')
               .replace(/on\w+\s*=/gi, '')
               .trim()
}

/**
 * Validate answer format
 * @param {any} answer - Answer to validate
 * @returns {boolean} Whether answer is valid
 */
export const isValidAnswer = (answer) => {
  return typeof answer === 'string' && ['A', 'B', 'C', 'D'].includes(answer.toUpperCase())
}

/**
 * Get exam progress percentage
 * @param {Object} answers - Current answers
 * @param {number} totalQuestions - Total number of questions
 * @returns {number} Progress percentage
 */
export const getExamProgress = (answers, totalQuestions) => {
  if (totalQuestions === 0) return 0
  const answeredCount = Object.keys(answers || {}).length
  return Math.round((answeredCount / totalQuestions) * 100)
}

/**
 * Format violation message for display
 * @param {Object} violation - Violation object
 * @returns {string} Formatted message
 */
export const formatViolationMessage = (violation) => {
  const time = new Date(violation.timestamp).toLocaleTimeString()
  return `${time}: ${violation.message}`
}

/**
 * Calculate time taken in human readable format
 * @param {string} startTime - Start time ISO string
 * @param {string} endTime - End time ISO string
 * @returns {string} Time taken in readable format
 */
export const calculateTimeTaken = (startTime, endTime) => {
  try {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const diffMs = end - start
    const diffMins = Math.floor(diffMs / 60000)
    const diffSecs = Math.floor((diffMs % 60000) / 1000)
    
    if (diffMins === 0) {
      return `${diffSecs} seconds`
    }
    return `${diffMins} minutes ${diffSecs} seconds`
  } catch (error) {
    return 'Unknown'
  }
}