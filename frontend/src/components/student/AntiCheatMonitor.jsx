import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Camera, Shield, AlertTriangle } from 'lucide-react'
import { VIOLATION_TYPES, VIOLATION_MESSAGES } from '@utils/constants'
import * as faceapi from '@vladmandic/face-api'

const AntiCheatMonitor = ({ onViolation, isActive }) => {
  const [violations, setViolations] = useState({
    tabSwitch: 0,
    fullscreenExit: 0,
    copyPaste: 0,
    faceDetection: 0,
    rightClick: 0
  })

  const [cameraActive, setCameraActive] = useState(false)
  const [isInFullscreen, setIsInFullscreen] = useState(false)
  const [isMonitoringPaused, setIsMonitoringPaused] = useState(false)

  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const canvasRef = useRef(null)
  const faceCheckIntervalRef = useRef(null)

  // Face detection state
  const [faceDetectionLoaded, setFaceDetectionLoaded] = useState(false)
  const [lastFaceCount, setLastFaceCount] = useState(0)
  const [noFaceStartTime, setNoFaceStartTime] = useState(null)

  // Violation cooldowns to prevent double counting
  const violationCooldowns = useRef({
    tabSwitch: 0,
    fullscreenExit: 0,
    copyPaste: 0,
    faceDetection: 0,
    rightClick: 0
  })

  // Track initial state to prevent false positives
  const initialStateRef = useRef({
    hasBeenFullscreen: false,
    hasBeenVisible: true,
    setupComplete: false
  })

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models')
        ])

        setFaceDetectionLoaded(true)
        console.log('✅ Face detection models loaded')
      } catch (error) {
        console.error('❌ Failed to load face detection models:', error)
        setFaceDetectionLoaded(false)
      }
    }

    if (isActive) loadModels()
  }, [isActive])

  // Robust debouncing with longer cooldowns
  const canTriggerViolation = useCallback(type => {
    const now = Date.now()
    const cooldownPeriods = {
      tabSwitch: 1000, // 1 seconds
      fullscreenExit: 5000, // 5 seconds
      copyPaste: 2000, // 2 seconds
      faceDetection: 10000, // 10 seconds for face detection
      rightClick: 1000 // 1 second
    }

    const lastTime = violationCooldowns.current[type]
    const cooldown = cooldownPeriods[type]

    if (now - lastTime < cooldown) {
      return false
    }

    violationCooldowns.current[type] = now
    return true
  }, [])

  const handleViolation = useCallback(
    (type, message) => {
      // Don't trigger violations if monitoring is paused or not active
      if (
        !isActive ||
        isMonitoringPaused ||
        !initialStateRef.current.setupComplete
      ) {
        return
      }

      // Check cooldown to prevent double counting
      if (!canTriggerViolation(type)) {
        return
      }

      console.log(`Violation triggered: ${type} - ${message}`)

      // Only update local state for display
      setViolations(prev => {
        const newViolations = { ...prev, [type]: prev[type] + 1 }
        return newViolations
      })

      // Call onViolation callback ONCE without local state manipulation
      if (onViolation) {
        onViolation({ type, message })
      }
    },
    [isActive, isMonitoringPaused, onViolation, canTriggerViolation]
  )
  const detectFaces = useCallback(async () => {
    if (
      !videoRef.current ||
      !faceapi ||
      !faceDetectionLoaded ||
      isMonitoringPaused
    ) {
      return
    }

    try {
      const video = videoRef.current
      if (video.readyState !== 4) return // Video not ready

      // ✅ Detect faces
      const detections = await faceapi
        .detectAllFaces(
          video,
          new faceapi.SsdMobilenetv1Options({ minConfidence: 0.6 })
        )
        .withFaceLandmarks()
        .withFaceDescriptors()

      const currentFaceCount = detections.length
      setLastFaceCount(currentFaceCount)

      // Create or update canvas overlay
      let canvas = canvasRef.current
      if (!canvas) {
        canvas = faceapi.createCanvasFromMedia(video)
        canvas.style.position = 'absolute'
        canvas.style.top = '0'
        canvas.style.left = '0'
        canvas.style.width = video.width + 'px'
        canvas.style.height = video.height + 'px'
        video.parentNode.appendChild(canvas)
        canvasRef.current = canvas
      }
      const dims = { width: video.videoWidth, height: video.videoHeight }
      faceapi.matchDimensions(canvas, dims)
      const resizedDetections = faceapi.resizeResults(detections, dims)

      // Clear old drawings
      const context = canvas.getContext('2d')
      context.clearRect(0, 0, canvas.width, canvas.height)

      // ✅ Draw bounding boxes + landmarks
      faceapi.draw.drawDetections(canvas, resizedDetections)
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)

      // --- Check for violations ---
      const now = Date.now()
      if (currentFaceCount === 0) {
        if (noFaceStartTime === null) {
          setNoFaceStartTime(now)
        } else if (now - noFaceStartTime > 3000) {
          handleViolation(
            'faceDetection',
            'No face detected - please ensure your face is clearly visible in the camera'
          )
          setNoFaceStartTime(null)
        }
      } else if (currentFaceCount > 1) {
        handleViolation(
          'faceDetection',
          `Multiple faces detected (${currentFaceCount}) - only the exam taker should be visible`
        )
        setNoFaceStartTime(null)
      } else {
        setNoFaceStartTime(null)
      }
    } catch (error) {
      console.error('Face detection error:', error)
    }
  }, [
    faceDetectionLoaded,
    isMonitoringPaused,
    handleViolation,
    noFaceStartTime
  ])

  useEffect(() => {
    if (!isActive) return

    const initializeCamera = async () => {
      try {
        // Pause monitoring while camera is setting up
        setIsMonitoringPaused(true)

        // 🔹 Stop any existing streams before opening a new one
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          }
        })

        if (videoRef.current && stream) {
          videoRef.current.srcObject = stream
          streamRef.current = stream

          // Play video safely
          await videoRef.current.play().catch(err => {
            console.warn('⚠️ Video play interrupted:', err)
          })

          setCameraActive(true)

          // Wait for video metadata (dimensions) before detection
          videoRef.current.onloadedmetadata = () => {
            if (faceDetectionLoaded && !faceCheckIntervalRef.current) {
              faceCheckIntervalRef.current = setInterval(detectFaces, 2000) // every 2 sec
            }
          }

          // Mark setup complete
          setTimeout(() => {
            setIsMonitoringPaused(false)
            initialStateRef.current.setupComplete = true
            console.log('✅ AntiCheat monitoring setup complete')
          }, 2000)
        }
      } catch (error) {
        console.error('❌ Camera access denied:', error)
        setCameraActive(false)

        if (error.name === 'NotAllowedError') {
          setTimeout(() => {
            handleViolation(
              'faceDetection',
              'Camera access denied - required for exam monitoring'
            )
          }, 3000)
        }

        // Complete setup even if no camera
        setTimeout(() => {
          setIsMonitoringPaused(false)
          initialStateRef.current.setupComplete = true
        }, 1000)
      }
    }

    initializeCamera()

    return () => {
      // 🔹 Cleanup on unmount
      if (faceCheckIntervalRef.current) {
        clearInterval(faceCheckIntervalRef.current)
        faceCheckIntervalRef.current = null
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
      setCameraActive(false)
    }
  }, [isActive, faceDetectionLoaded])

  // Start face detection when models are loaded
  useEffect(() => {
    if (
      faceDetectionLoaded &&
      cameraActive &&
      !faceCheckIntervalRef.current &&
      initialStateRef.current.setupComplete
    ) {
      faceCheckIntervalRef.current = setInterval(detectFaces, 2000)
    }
  }, [faceDetectionLoaded, cameraActive, detectFaces])

  // Tab Switch Detection - Fixed to prevent double counting
  useEffect(() => {
    if (!isActive) return

    let isCurrentlyVisible = !document.hidden
    let hasLeftPage = false
    let blurTimeoutId = null

    const handleVisibilityChange = () => {
      const wasVisible = isCurrentlyVisible
      isCurrentlyVisible = !document.hidden

      // Clear any pending blur timeout
      if (blurTimeoutId) {
        clearTimeout(blurTimeoutId)
        blurTimeoutId = null
      }

      if (
        wasVisible &&
        !isCurrentlyVisible &&
        initialStateRef.current.setupComplete &&
        !hasLeftPage
      ) {
        hasLeftPage = true

        setTimeout(() => {
          if (document.hidden && isActive && !isMonitoringPaused) {
            handleViolation(
              'tabSwitch',
              VIOLATION_MESSAGES[VIOLATION_TYPES.TAB_SWITCH]
            )
          }
        }, 500)
      }

      if (!wasVisible && isCurrentlyVisible) {
        hasLeftPage = false
      }
    }

    const handleFocus = () => {
      hasLeftPage = false
      if (blurTimeoutId) {
        clearTimeout(blurTimeoutId)
        blurTimeoutId = null
      }
    }

    const handleBlur = () => {
      if (!initialStateRef.current.setupComplete) return

      // Clear any existing timeout
      if (blurTimeoutId) {
        clearTimeout(blurTimeoutId)
      }

      // Set new timeout
      blurTimeoutId = setTimeout(() => {
        if (
          !document.hasFocus() &&
          isActive &&
          !isMonitoringPaused &&
          !document.hidden
        ) {
          handleViolation(
            'tabSwitch',
            'Focus lost - please stay focused on the exam'
          )
        }
        blurTimeoutId = null
      }, 1500) // Longer delay to prevent false positives
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
      if (blurTimeoutId) {
        clearTimeout(blurTimeoutId)
      }
    }
  }, [isActive, handleViolation, isMonitoringPaused])

  // Improved Fullscreen Detection
  useEffect(() => {
    if (!isActive) return

    const currentlyFullscreen = !!document.fullscreenElement
    setIsInFullscreen(currentlyFullscreen)

    if (currentlyFullscreen) {
      initialStateRef.current.hasBeenFullscreen = true
    }

    const handleFullscreenChange = () => {
      const wasFullscreen = isInFullscreen
      const isCurrentlyFullscreen = !!document.fullscreenElement

      setIsInFullscreen(isCurrentlyFullscreen)

      if (isCurrentlyFullscreen) {
        initialStateRef.current.hasBeenFullscreen = true
      }

      if (
        wasFullscreen &&
        !isCurrentlyFullscreen &&
        initialStateRef.current.hasBeenFullscreen &&
        initialStateRef.current.setupComplete &&
        isActive &&
        !isMonitoringPaused &&
        !document.hidden
      ) {
        setTimeout(() => {
          if (
            !document.fullscreenElement &&
            isActive &&
            !isMonitoringPaused &&
            !document.hidden
          ) {
            handleViolation(
              'fullscreenExit',
              VIOLATION_MESSAGES[VIOLATION_TYPES.FULLSCREEN_EXIT]
            )
          }
        }, 1000)
      }
    }

    const events = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'MSFullscreenChange'
    ]
    events.forEach(event => {
      document.addEventListener(event, handleFullscreenChange)
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleFullscreenChange)
      })
    }
  }, [isActive, handleViolation, isMonitoringPaused, isInFullscreen])

  // Keyboard and Mouse Event Prevention - Fixed
  useEffect(() => {
    if (!isActive) return

    const preventCopyPaste = e => {
      if (!initialStateRef.current.setupComplete || isMonitoringPaused) {
        return
      }

      const { ctrlKey, metaKey, key, keyCode } = e
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const cmdKey = isMac ? metaKey : ctrlKey

      // Block copy, paste, cut, select all
      if (cmdKey && ['c', 'v', 'x', 'a'].includes(key?.toLowerCase())) {
        e.preventDefault()
        handleViolation(
          'copyPaste',
          VIOLATION_MESSAGES[VIOLATION_TYPES.COPY_PASTE]
        )
        return
      }

      // Block Alt+Tab
      if (e.altKey && key === 'Tab') {
        e.preventDefault()
        handleViolation(
          'copyPaste',
          VIOLATION_MESSAGES[VIOLATION_TYPES.KEYBOARD_SHORTCUT]
        )
        return
      }

      // Block F12 and dev tools
      if (key === 'F12' || keyCode === 123) {
        e.preventDefault()
        handleViolation('Developer Tools blocked', 'Developer tools access blocked')
        return
      }

      if (
        cmdKey &&
        e.shiftKey &&
        ['i', 'j', 'c'].includes(key?.toLowerCase())
      ) {
        e.preventDefault()
        handleViolation('Developer Tools blocked', 'Developer tools shortcut blocked')
        return
      }

      // Block refresh
      if (
        (cmdKey && key?.toLowerCase() === 'r') ||
        key === 'F5' ||
        keyCode === 116
      ) {
        e.preventDefault()
        handleViolation('Page Refresh ', 'Page refresh blocked during exam')
        return
      }
    }

    const preventContextMenu = e => {
      if (!initialStateRef.current.setupComplete || isMonitoringPaused) {
        return
      }
      e.preventDefault()
      handleViolation(
        'rightClick',
        VIOLATION_MESSAGES[VIOLATION_TYPES.RIGHT_CLICK]
      )
    }

    const preventDrag = e => {
      if (['img', 'a'].includes(e.target.tagName?.toLowerCase())) {
        e.preventDefault()
      }
    }

    const preventSelect = e => {
      if (
        (e.ctrlKey || e.metaKey) &&
        initialStateRef.current.setupComplete &&
        !isMonitoringPaused
      ) {
        e.preventDefault()
      }
    }

    document.addEventListener('keydown', preventCopyPaste)
    document.addEventListener('contextmenu', preventContextMenu)
    document.addEventListener('dragstart', preventDrag)
    document.addEventListener('selectstart', preventSelect)

    const originalUserSelect = document.body.style.userSelect
    const originalWebkitUserSelect = document.body.style.webkitUserSelect
    const originalMsUserSelect = document.body.style.msUserSelect

    if (initialStateRef.current.setupComplete) {
      document.body.style.userSelect = 'none'
      document.body.style.webkitUserSelect = 'none'
      document.body.style.msUserSelect = 'none'
    }

    return () => {
      document.removeEventListener('keydown', preventCopyPaste)
      document.removeEventListener('contextmenu', preventContextMenu)
      document.removeEventListener('dragstart', preventDrag)
      document.removeEventListener('selectstart', preventSelect)

      document.body.style.userSelect = originalUserSelect
      document.body.style.webkitUserSelect = originalWebkitUserSelect
      document.body.style.msUserSelect = originalMsUserSelect
    }
  }, [isActive, handleViolation, isMonitoringPaused])

  // Pause monitoring temporarily
  const pauseMonitoring = useCallback((duration = 2000) => {
    setIsMonitoringPaused(true)
    setTimeout(() => {
      setIsMonitoringPaused(false)
    }, duration)
  }, [])

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (faceCheckIntervalRef.current) {
        clearInterval(faceCheckIntervalRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }

      document.body.style.userSelect = ''
      document.body.style.webkitUserSelect = ''
      document.body.style.msUserSelect = ''
    }
  }, [])

  // Expose pause function to parent component
  useEffect(() => {
    window.pauseAntiCheat = pauseMonitoring

    return () => {
      delete window.pauseAntiCheat
    }
  }, [pauseMonitoring])

  if (!isActive) return null

  const totalViolations = Object.values(violations).reduce((a, b) => a + b, 0)

  return (
    <div className='fixed top-20 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 min-w-[300px] max-h-[calc(100vh-6rem)] overflow-y-auto'>
      {/* Header */}
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center'>
          <Shield className='w-5 h-5 text-blue-600 mr-2' />
          <span className='font-semibold text-gray-800'>Security Monitor</span>
          {isMonitoringPaused && (
            <span className='ml-2 text-xs text-yellow-600 font-medium'>
              [PAUSED]
            </span>
          )}
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            totalViolations === 0
              ? 'bg-green-100 text-green-800'
              : totalViolations < 3
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {totalViolations} violations
        </span>
      </div>

      {/* Status Indicators */}
      <div className='mb-3 text-xs space-y-1'>
        <div className='flex items-center justify-between'>
          <span className='text-gray-600'>Monitoring:</span>
          <span
            className={`font-medium ${
              !isMonitoringPaused && initialStateRef.current.setupComplete
                ? 'text-green-600'
                : 'text-yellow-600'
            }`}
          >
            {!isMonitoringPaused && initialStateRef.current.setupComplete
              ? 'Active'
              : 'Initializing...'}
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-gray-600'>Fullscreen:</span>
          <span
            className={`font-medium ${
              isInFullscreen ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isInFullscreen ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-gray-600'>Camera:</span>
          <span
            className={`font-medium ${
              cameraActive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {cameraActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-gray-600'>Face Detection:</span>
          <span
            className={`font-medium ${
              faceDetectionLoaded ? 'text-green-600' : 'text-yellow-600'
            }`}
          >
            {faceDetectionLoaded ? 'Ready' : 'Loading...'}
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-gray-600'>Faces Detected:</span>
          <span
            className={`font-medium ${
              lastFaceCount === 1
                ? 'text-green-600'
                : lastFaceCount === 0
                ? 'text-orange-600'
                : 'text-red-600'
            }`}
          >
            {lastFaceCount}{' '}
            {lastFaceCount === 1 ? '✓' : lastFaceCount > 1 ? '⚠️' : '❌'}
          </span>
        </div>
      </div>

      {/* Camera Feed */}
      <div className='mb-3'>
        <div className='flex items-center mb-2'>
          <Camera className='w-4 h-4 text-gray-600 mr-2' />
          <span className='text-sm text-gray-600'>Camera Monitor</span>
          <div
            className={`ml-auto w-2 h-2 rounded-full ${
              cameraActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}
          ></div>
        </div>
        <div className='relative'>
          <video
            ref={videoRef}
            className='w-full h-20 bg-gray-200 rounded border object-cover'
            autoPlay
            muted
            playsInline
            style={{ transform: 'scaleX(-1)' }}
          />
          {!cameraActive && (
            <div className='absolute inset-0 flex items-center justify-center bg-gray-200 rounded'>
              <span className='text-xs text-gray-500'>Camera Unavailable</span>
            </div>
          )}
          {/* Face detection indicator */}
          {cameraActive && faceDetectionLoaded && (
            <div className='absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded'>
              {lastFaceCount === 0 && '❌ No Face'}
              {lastFaceCount === 1 && '✓ Face OK'}
              {lastFaceCount > 1 && `⚠️ ${lastFaceCount} Faces`}
            </div>
          )}
        </div>
      </div>

      {/* Violation Counters */}
      <div className='space-y-1 text-xs'>
        <div className='flex justify-between'>
          <span className='text-gray-600'>Tab Switch:</span>
          <span
            className={`font-medium ${
              violations.tabSwitch > 0 ? 'text-red-600' : 'text-gray-800'
            }`}
          >
            {violations.tabSwitch}
          </span>
        </div>
        <div className='flex justify-between'>
          <span className='text-gray-600'>Fullscreen Exit:</span>
          <span
            className={`font-medium ${
              violations.fullscreenExit > 0 ? 'text-red-600' : 'text-gray-800'
            }`}
          >
            {violations.fullscreenExit}
          </span>
        </div>
        <div className='flex justify-between'>
          <span className='text-gray-600'>Copy/Paste:</span>
          <span
            className={`font-medium ${
              violations.copyPaste > 0 ? 'text-red-600' : 'text-gray-800'
            }`}
          >
            {violations.copyPaste}
          </span>
        </div>
        <div className='flex justify-between'>
          <span className='text-gray-600'>Face Issues:</span>
          <span
            className={`font-medium ${
              violations.faceDetection > 0 ? 'text-red-600' : 'text-gray-800'
            }`}
          >
            {violations.faceDetection}
          </span>
        </div>
        <div className='flex justify-between'>
          <span className='text-gray-600'>Right Click:</span>
          <span
            className={`font-medium ${
              violations.rightClick > 0 ? 'text-red-600' : 'text-gray-800'
            }`}
          >
            {violations.rightClick}
          </span>
        </div>
      </div>

      {/* Warning */}
      {totalViolations > 0 && (
        <div className='mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs'>
          <div className='flex items-center text-yellow-800'>
            <AlertTriangle className='w-3 h-3 mr-1' />
            <span className='font-medium'>Security Alert</span>
          </div>
          <p className='text-yellow-700 mt-1'>
            {totalViolations} violation{totalViolations !== 1 ? 's' : ''}{' '}
            detected. Stay focused on the exam.
          </p>
        </div>
      )}
    </div>
  )
}

export default AntiCheatMonitor
