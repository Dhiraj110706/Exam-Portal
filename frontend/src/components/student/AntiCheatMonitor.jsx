import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Camera, Shield, AlertTriangle } from 'lucide-react'
import { VIOLATION_TYPES, VIOLATION_MESSAGES } from '@utils/constants'

const AntiCheatMonitor = ({ onViolation, isActive }) => {
  const [violations, setViolations] = useState({
    tabSwitch: 0,
    fullscreenExit: 0,
    copyPaste: 0,
    faceDetection: 0,
    rightClick: 0
  })
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const handleViolation = useCallback((type, message) => {
    const newViolations = { ...violations, [type]: violations[type] + 1 }
    setViolations(newViolations)
    
    const totalViolations = Object.values(newViolations).reduce((a, b) => a + b, 0)
    onViolation({ type, message, totalViolations })
  }, [violations, onViolation])

  // Initialize Camera
  useEffect(() => {
    if (!isActive) return

    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 320, height: 240 } 
        })
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
          streamRef.current = stream
          setCameraActive(true)

          // Simulate face detection (in real implementation, use MediaPipe)
          const faceCheckInterval = setInterval(() => {
            if (Math.random() < 0.05) { // 5% chance of face not detected
              handleViolation('faceDetection', VIOLATION_MESSAGES[VIOLATION_TYPES.FACE_NOT_DETECTED])
            }
          }, 10000) // Check every 10 seconds

          return () => {
            clearInterval(faceCheckInterval)
          }
        }
      } catch (error) {
        console.error('Camera access denied:', error)
        handleViolation('faceDetection', 'Camera access denied')
      }
    }

    initializeCamera()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [isActive, handleViolation])

  // Tab Switch Detection
  useEffect(() => {
    if (!isActive) return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation('tabSwitch', VIOLATION_MESSAGES[VIOLATION_TYPES.TAB_SWITCH])
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isActive, handleViolation])

  // Fullscreen Exit Detection
  useEffect(() => {
    if (!isActive) return

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        handleViolation('fullscreenExit', VIOLATION_MESSAGES[VIOLATION_TYPES.FULLSCREEN_EXIT])
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [isActive, handleViolation])

  // Copy/Paste/Right-click Prevention
  useEffect(() => {
    if (!isActive) return

    const preventCopyPaste = (e) => {
      if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a')) {
        e.preventDefault()
        handleViolation('copyPaste', VIOLATION_MESSAGES[VIOLATION_TYPES.COPY_PASTE])
      }
      
      // Block other shortcuts
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault()
        handleViolation('copyPaste', VIOLATION_MESSAGES[VIOLATION_TYPES.KEYBOARD_SHORTCUT])
      }
      
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault()
        handleViolation('copyPaste', 'Developer tools blocked')
      }
    }

    const preventContextMenu = (e) => {
      e.preventDefault()
      handleViolation('rightClick', VIOLATION_MESSAGES[VIOLATION_TYPES.RIGHT_CLICK])
    }

    const preventDrag = (e) => {
      e.preventDefault()
    }

    const preventSelect = (e) => {
      if (e.ctrlKey) {
        e.preventDefault()
      }
    }

    document.addEventListener('keydown', preventCopyPaste)
    document.addEventListener('contextmenu', preventContextMenu)
    document.addEventListener('dragstart', preventDrag)
    document.addEventListener('selectstart', preventSelect)

    return () => {
      document.removeEventListener('keydown', preventCopyPaste)
      document.removeEventListener('contextmenu', preventContextMenu)
      document.removeEventListener('dragstart', preventDrag)
      document.removeEventListener('selectstart', preventSelect)
    }
  }, [isActive, handleViolation])

  if (!isActive) return null

  const totalViolations = Object.values(violations).reduce((a, b) => a + b, 0)

  return (
    <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 min-w-[280px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Shield className="w-5 h-5 text-blue-600 mr-2" />
          <span className="font-semibold text-gray-800">Security Monitor</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          totalViolations === 0 
            ? 'bg-green-100 text-green-800'
            : totalViolations < 3 
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {totalViolations} violations
        </span>
      </div>

      {/* Camera Feed */}
      <div className="mb-3">
        <div className="flex items-center mb-2">
          <Camera className="w-4 h-4 text-gray-600 mr-2" />
          <span className="text-sm text-gray-600">Camera Monitor</span>
          <div className={`ml-auto w-2 h-2 rounded-full ${
            cameraActive ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
        </div>
        <video
          ref={videoRef}
          className="w-full h-20 bg-gray-200 rounded border object-cover"
          muted
          playsInline
        />
      </div>

      {/* Violation Counters */}
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600">Tab Switch:</span>
          <span className="font-medium">{violations.tabSwitch}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Fullscreen Exit:</span>
          <span className="font-medium">{violations.fullscreenExit}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Copy/Paste:</span>
          <span className="font-medium">{violations.copyPaste}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Face Issues:</span>
          <span className="font-medium">{violations.faceDetection}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Right Click:</span>
          <span className="font-medium">{violations.rightClick}</span>
        </div>
      </div>

      {/* Warning */}
      {totalViolations > 0 && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <div className="flex items-center text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            <span className="font-medium">Security Alert</span>
          </div>
          <p className="text-yellow-700 mt-1">
            Violations detected. Exam may auto-submit at limit.
          </p>
        </div>
      )}
    </div>
  )
}

export default AntiCheatMonitor