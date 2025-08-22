// // import React, { useState, useEffect, useRef, useCallback } from 'react'
// // import { Camera, Shield, AlertTriangle } from 'lucide-react'
// // import { VIOLATION_TYPES, VIOLATION_MESSAGES } from '@utils/constants'

// // const AntiCheatMonitor = ({ onViolation, isActive }) => {
// //   const [violations, setViolations] = useState({
// //     tabSwitch: 0,
// //     fullscreenExit: 0,
// //     copyPaste: 0,
// //     faceDetection: 0,
// //     rightClick: 0
// //   })
// //   const [cameraActive, setCameraActive] = useState(false)
// //   const videoRef = useRef(null)
// //   const streamRef = useRef(null)

// //   const handleViolation = useCallback((type, message) => {
// //     const newViolations = { ...violations, [type]: violations[type] + 1 }
// //     setViolations(newViolations)

// //     const totalViolations = Object.values(newViolations).reduce((a, b) => a + b, 0)
// //     onViolation({ type, message, totalViolations })
// //   }, [violations, onViolation])

// //   // Initialize Camera
// //   useEffect(() => {
// //     if (!isActive) return

// //     const initializeCamera = async () => {
// //       try {
// //         const stream = await navigator.mediaDevices.getUserMedia({
// //           video: { width: 320, height: 240 }
// //         })

// //         if (videoRef.current) {
// //           videoRef.current.srcObject = stream
// //           videoRef.current.play()
// //           streamRef.current = stream
// //           setCameraActive(true)

// //           // Simulate face detection (in real implementation, use MediaPipe)
// //           const faceCheckInterval = setInterval(() => {
// //             if (Math.random() < 0.05) { // 5% chance of face not detected
// //               handleViolation('faceDetection', VIOLATION_MESSAGES[VIOLATION_TYPES.FACE_NOT_DETECTED])
// //             }
// //           }, 10000) // Check every 10 seconds

// //           return () => {
// //             clearInterval(faceCheckInterval)
// //           }
// //         }
// //       } catch (error) {
// //         console.error('Camera access denied:', error)
// //         handleViolation('faceDetection', 'Camera access denied')
// //       }
// //     }

// //     initializeCamera()

// //     return () => {
// //       if (streamRef.current) {
// //         streamRef.current.getTracks().forEach(track => track.stop())
// //       }
// //     }
// //   }, [isActive, handleViolation])

// //   // Tab Switch Detection
// //   useEffect(() => {
// //     if (!isActive) return

// //     const handleVisibilityChange = () => {
// //       if (document.hidden) {
// //         handleViolation('tabSwitch', VIOLATION_MESSAGES[VIOLATION_TYPES.TAB_SWITCH])
// //       }
// //     }

// //     document.addEventListener('visibilitychange', handleVisibilityChange)
// //     return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
// //   }, [isActive, handleViolation])

// //   // Fullscreen Exit Detection
// //   useEffect(() => {
// //     if (!isActive) return

// //     const handleFullscreenChange = () => {
// //       if (!document.fullscreenElement) {
// //         handleViolation('fullscreenExit', VIOLATION_MESSAGES[VIOLATION_TYPES.FULLSCREEN_EXIT])
// //       }
// //     }

// //     document.addEventListener('fullscreenchange', handleFullscreenChange)
// //     return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
// //   }, [isActive, handleViolation])

// //   // Copy/Paste/Right-click Prevention
// //   useEffect(() => {
// //     if (!isActive) return

// //     const preventCopyPaste = (e) => {
// //       if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a')) {
// //         e.preventDefault()
// //         handleViolation('copyPaste', VIOLATION_MESSAGES[VIOLATION_TYPES.COPY_PASTE])
// //       }

// //       // Block other shortcuts
// //       if (e.altKey && e.key === 'Tab') {
// //         e.preventDefault()
// //         handleViolation('copyPaste', VIOLATION_MESSAGES[VIOLATION_TYPES.KEYBOARD_SHORTCUT])
// //       }

// //       if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
// //         e.preventDefault()
// //         handleViolation('copyPaste', 'Developer tools blocked')
// //       }
// //     }

// //     const preventContextMenu = (e) => {
// //       e.preventDefault()
// //       handleViolation('rightClick', VIOLATION_MESSAGES[VIOLATION_TYPES.RIGHT_CLICK])
// //     }

// //     const preventDrag = (e) => {
// //       e.preventDefault()
// //     }

// //     const preventSelect = (e) => {
// //       if (e.ctrlKey) {
// //         e.preventDefault()
// //       }
// //     }

// //     document.addEventListener('keydown', preventCopyPaste)
// //     document.addEventListener('contextmenu', preventContextMenu)
// //     document.addEventListener('dragstart', preventDrag)
// //     document.addEventListener('selectstart', preventSelect)

// //     return () => {
// //       document.removeEventListener('keydown', preventCopyPaste)
// //       document.removeEventListener('contextmenu', preventContextMenu)
// //       document.removeEventListener('dragstart', preventDrag)
// //       document.removeEventListener('selectstart', preventSelect)
// //     }
// //   }, [isActive, handleViolation])

// //   if (!isActive) return null

// //   const totalViolations = Object.values(violations).reduce((a, b) => a + b, 0)

// //   return (
// //     <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 min-w-[280px]">
// //       {/* Header */}
// //       <div className="flex items-center justify-between mb-3">
// //         <div className="flex items-center">
// //           <Shield className="w-5 h-5 text-blue-600 mr-2" />
// //           <span className="font-semibold text-gray-800">Security Monitor</span>
// //         </div>
// //         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
// //           totalViolations === 0
// //             ? 'bg-green-100 text-green-800'
// //             : totalViolations < 3
// //             ? 'bg-yellow-100 text-yellow-800'
// //             : 'bg-red-100 text-red-800'
// //         }`}>
// //           {totalViolations} violations
// //         </span>
// //       </div>

// //       {/* Camera Feed */}
// //       <div className="mb-3">
// //         <div className="flex items-center mb-2">
// //           <Camera className="w-4 h-4 text-gray-600 mr-2" />
// //           <span className="text-sm text-gray-600">Camera Monitor</span>
// //           <div className={`ml-auto w-2 h-2 rounded-full ${
// //             cameraActive ? 'bg-green-500' : 'bg-red-500'
// //           }`}></div>
// //         </div>
// //         <video
// //           ref={videoRef}
// //           className="w-full h-20 bg-gray-200 rounded border object-cover"
// //           muted
// //           playsInline
// //         />
// //       </div>

// //       {/* Violation Counters */}
// //       <div className="space-y-1 text-xs">
// //         <div className="flex justify-between">
// //           <span className="text-gray-600">Tab Switch:</span>
// //           <span className="font-medium">{violations.tabSwitch}</span>
// //         </div>
// //         <div className="flex justify-between">
// //           <span className="text-gray-600">Fullscreen Exit:</span>
// //           <span className="font-medium">{violations.fullscreenExit}</span>
// //         </div>
// //         <div className="flex justify-between">
// //           <span className="text-gray-600">Copy/Paste:</span>
// //           <span className="font-medium">{violations.copyPaste}</span>
// //         </div>
// //         <div className="flex justify-between">
// //           <span className="text-gray-600">Face Issues:</span>
// //           <span className="font-medium">{violations.faceDetection}</span>
// //         </div>
// //         <div className="flex justify-between">
// //           <span className="text-gray-600">Right Click:</span>
// //           <span className="font-medium">{violations.rightClick}</span>
// //         </div>
// //       </div>

// //       {/* Warning */}
// //       {totalViolations > 0 && (
// //         <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
// //           <div className="flex items-center text-yellow-800">
// //             <AlertTriangle className="w-3 h-3 mr-1" />
// //             <span className="font-medium">Security Alert</span>
// //           </div>
// //           <p className="text-yellow-700 mt-1">
// //             Violations detected. Exam may auto-submit at limit.
// //           </p>
// //         </div>
// //       )}
// //     </div>
// //   )
// // }

// // export default AntiCheatMonitor
// import React, { useState, useEffect, useRef, useCallback } from 'react'
// import { Camera, Shield, AlertTriangle } from 'lucide-react'
// import { VIOLATION_TYPES, VIOLATION_MESSAGES } from '@utils/constants'

// const AntiCheatMonitor = ({ onViolation, isActive }) => {
//   const [violations, setViolations] = useState({
//     tabSwitch: 0,
//     fullscreenExit: 0,
//     copyPaste: 0,
//     faceDetection: 0,
//     rightClick: 0
//   })

//   const [cameraActive, setCameraActive] = useState(false)
//   const [isInFullscreen, setIsInFullscreen] = useState(false)
//   const [isMonitoringPaused, setIsMonitoringPaused] = useState(false)

//   const videoRef = useRef(null)
//   const streamRef = useRef(null)
//   const faceCheckIntervalRef = useRef(null)

//   // Much more aggressive violation cooldowns
//   const violationCooldowns = useRef({
//     tabSwitch: 0,
//     fullscreenExit: 0,
//     copyPaste: 0,
//     faceDetection: 0,
//     rightClick: 0
//   })

//   // Track initial state to prevent false positives
//   const initialStateRef = useRef({
//     hasBeenFullscreen: false,
//     hasBeenVisible: true,
//     setupComplete: false
//   })

//   // Robust debouncing with longer cooldowns
//   const canTriggerViolation = useCallback((type) => {
//     const now = Date.now()
//     const cooldownPeriods = {
//       tabSwitch: 5000,      // 5 seconds
//       fullscreenExit: 3000, // 3 seconds
//       copyPaste: 2000,      // 2 seconds
//       faceDetection: 30000, // 30 seconds (much longer for face detection)
//       rightClick: 1000      // 1 second
//     }

//     const lastTime = violationCooldowns.current[type]
//     const cooldown = cooldownPeriods[type]

//     if (now - lastTime < cooldown) {
//       return false
//     }

//     violationCooldowns.current[type] = now
//     return true
//   }, [])

//   const handleViolation = useCallback((type, message) => {
//     // Don't trigger violations if monitoring is paused or not active
//     if (!isActive || isMonitoringPaused || !initialStateRef.current.setupComplete) {
//       return
//     }

//     // Check cooldown
//     if (!canTriggerViolation(type)) {
//       return
//     }

//     console.log(`Violation triggered: ${type} - ${message}`)

//     setViolations(prev => {
//       const newViolations = { ...prev, [type]: prev[type] + 1 }
//       const totalViolations = Object.values(newViolations).reduce((a, b) => a + b, 0)

//       // Call onViolation with proper delay to prevent blocking
//       setTimeout(() => {
//         if (isActive && !isMonitoringPaused) {
//           onViolation({ type, message, totalViolations })
//         }
//       }, 100)

//       return newViolations
//     })
//   }, [isActive, isMonitoringPaused, onViolation, canTriggerViolation])

//   // Initialize Camera with better error handling and less aggressive face detection
//   useEffect(() => {
//     if (!isActive) return

//     const initializeCamera = async () => {
//       try {
//         // Temporarily pause monitoring during camera setup
//         setIsMonitoringPaused(true)

//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: {
//             width: { ideal: 320 },
//             height: { ideal: 240 },
//             facingMode: 'user'
//           }
//         })

//         if (videoRef.current && stream) {
//           videoRef.current.srcObject = stream
//           await videoRef.current.play()
//           streamRef.current = stream
//           setCameraActive(true)

//           // Much more conservative face detection - only for demo purposes
//           // In production, this should use actual face detection library
//           faceCheckIntervalRef.current = setInterval(() => {
//             // Only 0.1% chance every 60 seconds - very rare false positive
//             if (Math.random() < 0.001) {
//               handleViolation('faceDetection', 'Face detection: Please ensure your face is clearly visible')
//             }
//           }, 5000) // Check every 60 seconds instead of 20

//           // Setup complete after camera initialization
//           setTimeout(() => {
//             setIsMonitoringPaused(false)
//             initialStateRef.current.setupComplete = true
//             console.log('AntiCheat monitoring setup complete')
//           }, 2000)
//         }
//       } catch (error) {
//         console.error('Camera access denied:', error)
//         setCameraActive(true)

//         // Only report camera error once and only if it's a real denial
//         if (error.name === 'NotAllowedError') {
//           handleViolation('faceDetection', 'Camera access denied - required for exam monitoring')
//         }

//         // Still complete setup even without camera
//         setTimeout(() => {
//           setIsMonitoringPaused(false)
//           initialStateRef.current.setupComplete = true
//         }, 1000)
//       }
//     }

//     initializeCamera()

//     return () => {
//       if (faceCheckIntervalRef.current) {
//         clearInterval(faceCheckIntervalRef.current)
//         faceCheckIntervalRef.current = null
//       }
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach(track => track.stop())
//         streamRef.current = null
//         setCameraActive(false)
//       }
//     }
//   }, [isActive])

//   // Much improved Tab Switch Detection
//   useEffect(() => {
//     if (!isActive) return

//     let isCurrentlyVisible = !document.hidden
//     let hasLeftPage = false

//     const handleVisibilityChange = () => {
//       const wasVisible = isCurrentlyVisible
//       isCurrentlyVisible = !document.hidden

//       // Only trigger if:
//       // 1. We went from visible to hidden (tab switch out)
//       // 2. Setup is complete
//       // 3. We haven't already detected a leave
//       if (wasVisible && !isCurrentlyVisible && initialStateRef.current.setupComplete && !hasLeftPage) {
//         hasLeftPage = true

//         // Add delay to confirm it's a real tab switch, not a momentary event
//         setTimeout(() => {
//           if (document.hidden && isActive && !isMonitoringPaused) {
//             handleViolation('tabSwitch', VIOLATION_MESSAGES[VIOLATION_TYPES.TAB_SWITCH])
//           }
//         }, 500)
//       }

//       // Reset flag when returning to page
//       if (!wasVisible && isCurrentlyVisible) {
//         hasLeftPage = false
//       }
//     }

//     const handleFocus = () => {
//       hasLeftPage = false
//     }

//     const handleBlur = () => {
//       // Only check for blur after setup is complete
//       if (!initialStateRef.current.setupComplete) return

//       // Add significant delay to avoid false positives from clicks
//       setTimeout(() => {
//         if (!document.hasFocus() && isActive && !isMonitoringPaused && !document.hidden) {
//           handleViolation('tabSwitch', 'Focus lost - please stay focused on the exam')
//         }
//       }, 1000)
//     }

//     document.addEventListener('visibilitychange', handleVisibilityChange)
//     window.addEventListener('focus', handleFocus)
//     window.addEventListener('blur', handleBlur)

//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange)
//       window.removeEventListener('focus', handleFocus)
//       window.removeEventListener('blur', handleBlur)
//     }
//   }, [isActive, handleViolation, isMonitoringPaused])

//   // Improved Fullscreen Detection with proper state tracking
//   useEffect(() => {
//     if (!isActive) return

//     // Set initial fullscreen state
//     const currentlyFullscreen = !!document.fullscreenElement
//     setIsInFullscreen(currentlyFullscreen)

//     if (currentlyFullscreen) {
//       initialStateRef.current.hasBeenFullscreen = true
//     }

//     const handleFullscreenChange = () => {
//       const wasFullscreen = isInFullscreen
//       const isCurrentlyFullscreen = !!document.fullscreenElement

//       setIsInFullscreen(isCurrentlyFullscreen)

//       // Track that we've been in fullscreen
//       if (isCurrentlyFullscreen) {
//         initialStateRef.current.hasBeenFullscreen = true
//       }

//       // Only trigger violation if:
//       // 1. We were actually in fullscreen before
//       // 2. We're now exiting fullscreen
//       // 3. Setup is complete
//       // 4. This isn't due to exam ending
//       if (wasFullscreen &&
//           !isCurrentlyFullscreen &&
//           initialStateRef.current.hasBeenFullscreen &&
//           initialStateRef.current.setupComplete &&
//           isActive &&
//           !isMonitoringPaused &&
//           !document.hidden
//         ) {

//         // Add delay to prevent false positives from programmatic exits
//         setTimeout(() => {
//           if (!document.fullscreenElement && isActive && !isMonitoringPaused && !document.hidden) {
//             handleViolation('fullscreenExit', VIOLATION_MESSAGES[VIOLATION_TYPES.FULLSCREEN_EXIT])
//           }
//         }, 1000)
//       }
//     }

//     // Add all fullscreen event listeners for cross-browser support
//     const events = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange']
//     events.forEach(event => {
//       document.addEventListener(event, handleFullscreenChange)
//     })

//     return () => {
//       events.forEach(event => {
//         document.removeEventListener(event, handleFullscreenChange)
//       })
//     }
//   }, [isActive, handleViolation, isMonitoringPaused, isInFullscreen])

//   // More reasonable Keyboard and Mouse Event Prevention
//   useEffect(() => {
//     if (!isActive) return

//     const preventCopyPaste = (e) => {
//       // Don't trigger during setup
//       if (!initialStateRef.current.setupComplete || isMonitoringPaused) {
//         return
//       }

//       const { ctrlKey, metaKey, key, keyCode } = e
//       const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
//       const cmdKey = isMac ? metaKey : ctrlKey

//       // Block copy, paste, cut, select all - but be more specific
//       if (cmdKey && ['c', 'v', 'x'].includes(key?.toLowerCase())) {
//         e.preventDefault()
//         handleViolation('copyPaste', VIOLATION_MESSAGES[VIOLATION_TYPES.COPY_PASTE])
//         return
//       }

//       // Block select all only in input fields to be less aggressive
//       if (cmdKey && key?.toLowerCase() === 'a' &&
//           ['input', 'textarea'].includes(e.target.tagName?.toLowerCase())) {
//         e.preventDefault()
//         handleViolation('copyPaste', 'Select all blocked in input fields')
//         return
//       }

//       // Block Alt+Tab (Windows/Linux) - more carefully
//       if (e.altKey && key === 'Tab') {
//         e.preventDefault()
//         handleViolation('copyPaste', VIOLATION_MESSAGES[VIOLATION_TYPES.KEYBOARD_SHORTCUT])
//         return
//       }

//       // Block F12 and common developer shortcuts
//       if (key === 'F12' || keyCode === 123) {
//         e.preventDefault()
//         handleViolation('copyPaste', 'Developer tools access blocked')
//         return
//       }

//       // Block common dev tool shortcuts
//       if (cmdKey && e.shiftKey && ['i', 'j', 'c'].includes(key?.toLowerCase())) {
//         e.preventDefault()
//         handleViolation('copyPaste', 'Developer tools shortcut blocked')
//         return
//       }

//       // Block refresh - but allow it sometimes for legitimate reasons
//       if (cmdKey && key?.toLowerCase() === 'r') {
//         e.preventDefault()
//         handleViolation('copyPaste', 'Page refresh blocked during exam')
//         return
//       }

//       if (key === 'F5' || keyCode === 116) {
//         e.preventDefault()
//         handleViolation('copyPaste', 'Page refresh blocked during exam')
//         return
//       }

//       // Don't block Escape key - let fullscreen handle it naturally
//     }

//     const preventContextMenu = (e) => {
//       // Don't trigger during setup
//       if (!initialStateRef.current.setupComplete || isMonitoringPaused) {
//         return
//       }

//       e.preventDefault()
//       handleViolation('rightClick', VIOLATION_MESSAGES[VIOLATION_TYPES.RIGHT_CLICK])
//     }

//     const preventDrag = (e) => {
//       // Only prevent drag for images and links to avoid interfering with normal UI
//       if (['img', 'a'].includes(e.target.tagName?.toLowerCase())) {
//         e.preventDefault()
//       }
//     }

//     const preventSelect = (e) => {
//       // Less aggressive text selection prevention
//       if ((e.ctrlKey || e.metaKey) &&
//           initialStateRef.current.setupComplete &&
//           !isMonitoringPaused) {
//         e.preventDefault()
//       }
//     }

//     // Add event listeners with passive option where appropriate
//     document.addEventListener('keydown', preventCopyPaste)
//     document.addEventListener('contextmenu', preventContextMenu)
//     document.addEventListener('dragstart', preventDrag)
//     document.addEventListener('selectstart', preventSelect)

//     // Less aggressive text selection blocking
//     const originalUserSelect = document.body.style.userSelect
//     const originalWebkitUserSelect = document.body.style.webkitUserSelect
//     const originalMsUserSelect = document.body.style.msUserSelect

//     // Only apply after setup is complete
//     if (initialStateRef.current.setupComplete) {
//       document.body.style.userSelect = 'none'
//       document.body.style.webkitUserSelect = 'none'
//       document.body.style.msUserSelect = 'none'
//     }

//     return () => {
//       document.removeEventListener('keydown', preventCopyPaste)
//       document.removeEventListener('contextmenu', preventContextMenu)
//       document.removeEventListener('dragstart', preventDrag)
//       document.removeEventListener('selectstart', preventSelect)

//       // Restore original styles
//       document.body.style.userSelect = originalUserSelect
//       document.body.style.webkitUserSelect = originalWebkitUserSelect
//       document.body.style.msUserSelect = originalMsUserSelect
//     }
//   }, [isActive, handleViolation, isMonitoringPaused])

//   // Pause monitoring temporarily (useful for transitions)
//   const pauseMonitoring = useCallback((duration = 2000) => {
//     setIsMonitoringPaused(true)
//     setTimeout(() => {
//       setIsMonitoringPaused(false)
//     }, duration)
//   }, [])

//   // Cleanup on component unmount
//   useEffect(() => {
//     return () => {
//       if (faceCheckIntervalRef.current) {
//         clearInterval(faceCheckIntervalRef.current)
//       }
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach(track => track.stop())
//       }

//       // Reset global styles
//       document.body.style.userSelect = ''
//       document.body.style.webkitUserSelect = ''
//       document.body.style.msUserSelect = ''
//     }
//   }, [])

//   // Expose pause function to parent component
//   useEffect(() => {
//     // Store pause function on window for external access if needed
//     window.pauseAntiCheat = pauseMonitoring

//     return () => {
//       delete window.pauseAntiCheat
//     }
//   }, [pauseMonitoring])

//   if (!isActive) return null

//   const totalViolations = Object.values(violations).reduce((a, b) => a + b, 0)

//   return (
//     <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 min-w-[280px]">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-3">
//         <div className="flex items-center">
//           <Shield className="w-5 h-5 text-blue-600 mr-2" />
//           <span className="font-semibold text-gray-800">Security Monitor</span>
//           {isMonitoringPaused && (
//             <span className="ml-2 text-xs text-yellow-600 font-medium">[PAUSED]</span>
//           )}
//         </div>
//         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//           totalViolations === 0
//             ? 'bg-green-100 text-green-800'
//             : totalViolations < 3
//             ? 'bg-yellow-100 text-yellow-800'
//             : 'bg-red-100 text-red-800'
//         }`}>
//           {totalViolations} violations
//         </span>
//       </div>

//       {/* Status Indicators */}
//       <div className="mb-3 text-xs space-y-1">
//         <div className="flex items-center justify-between">
//           <span className="text-gray-600">Monitoring:</span>
//           <span className={`font-medium ${
//             !isMonitoringPaused && initialStateRef.current.setupComplete
//               ? 'text-green-600'
//               : 'text-yellow-600'
//           }`}>
//             {!isMonitoringPaused && initialStateRef.current.setupComplete ? 'Active' : 'Initializing...'}
//           </span>
//         </div>
//         <div className="flex items-center justify-between">
//           <span className="text-gray-600">Fullscreen:</span>
//           <span className={`font-medium ${isInFullscreen ? 'text-green-600' : 'text-red-600'}`}>
//             {isInFullscreen ? 'Active' : 'Inactive'}
//           </span>
//         </div>
//         <div className="flex items-center justify-between">
//           <span className="text-gray-600">Camera:</span>
//           <span className={`font-medium ${cameraActive ? 'text-green-600' : 'text-red-600'}`}>
//             {cameraActive ? 'Active' : 'Inactive'}
//           </span>
//         </div>
//       </div>

//       {/* Camera Feed */}
//       <div className="mb-3">
//         <div className="flex items-center mb-2">
//           <Camera className="w-4 h-4 text-gray-600 mr-2" />
//           <span className="text-sm text-gray-600">Camera Monitor</span>
//           <div className={`ml-auto w-2 h-2 rounded-full ${
//             cameraActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'
//           }`}></div>
//         </div>
//         <video
//           ref={videoRef}
//           className="w-full h-20 bg-gray-200 rounded border object-cover"
//           autoPlay
//           muted
//           playsInline
//         //   style={{ transform: 'scaleX(-1)' }} // Mirror the video
//         />
//         {!cameraActive && (
//           <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded">
//             <span className="text-xs text-gray-500">Camera Unavailable</span>
//           </div>
//         )}
//       </div>

//       {/* Violation Counters */}
//       <div className="space-y-1 text-xs">
//         <div className="flex justify-between">
//           <span className="text-gray-600">Tab Switch:</span>
//           <span className={`font-medium ${violations.tabSwitch > 0 ? 'text-red-600' : 'text-gray-800'}`}>
//             {violations.tabSwitch}
//           </span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-600">Fullscreen Exit:</span>
//           <span className={`font-medium ${violations.fullscreenExit > 0 ? 'text-red-600' : 'text-gray-800'}`}>
//             {violations.fullscreenExit}
//           </span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-600">Copy/Paste:</span>
//           <span className={`font-medium ${violations.copyPaste > 0 ? 'text-red-600' : 'text-gray-800'}`}>
//             {violations.copyPaste}
//           </span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-600">Face Issues:</span>
//           <span className={`font-medium ${violations.faceDetection > 0 ? 'text-red-600' : 'text-gray-800'}`}>
//             {violations.faceDetection}
//           </span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-600">Right Click:</span>
//           <span className={`font-medium ${violations.rightClick > 0 ? 'text-red-600' : 'text-gray-800'}`}>
//             {violations.rightClick}
//           </span>
//         </div>
//       </div>

//       {/* Debug Info (only show in development) */}
//       {process.env.NODE_ENV === 'development' && (
//         <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
//           <div>Setup: {initialStateRef.current.setupComplete ? '✓' : '⏳'}</div>
//           <div>Paused: {isMonitoringPaused ? '✓' : '✗'}</div>
//           <div>Been FS: {initialStateRef.current.hasBeenFullscreen ? '✓' : '✗'}</div>
//         </div>
//       )}

//       {/* Warning */}
//       {totalViolations > 0 && (
//         <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
//           <div className="flex items-center text-yellow-800">
//             <AlertTriangle className="w-3 h-3 mr-1" />
//             <span className="font-medium">Security Alert</span>
//           </div>
//           <p className="text-yellow-700 mt-1">
//             {totalViolations} violation{totalViolations !== 1 ? 's' : ''} detected.
//             {totalViolations >= 3 ? ' Approaching limit!' : ' Stay focused on the exam.'}
//           </p>
//         </div>
//       )}
//     </div>
//   )
// }

// export default AntiCheatMonitor

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

  // Load face-api.js for real face detection
  // useEffect(() => {
  //   const loadFaceAPI = async () => {
  //     try {
  //       // Load face-api.js from CDN
  //       if (!window.faceapi) {
  //         const script = document.createElement('script')
  //         script.src = 'https://cdnjs.cloudflare.com/ajax/libs/face-api.js/0.22.2/face-api.min.js'
  //         script.onload = async () => {
  //           try {
  //             // Load models
  //             await Promise.all([
  //               window.faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  //               window.faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  //               window.faceapi.nets.faceRecognitionNet.loadFromUri('/models')
  //             ])
  //             setFaceDetectionLoaded(true)
  //             console.log('Face detection models loaded successfully')
  //           } catch (error) {
  //             console.error('Failed to load face detection models:', error)
  //             setFaceDetectionLoaded(false)
  //           }
  //         }
  //         script.onerror = () => {
  //           console.error('Failed to load face-api.js')
  //           setFaceDetectionLoaded(false)
  //         }
  //         document.head.appendChild(script)
  //       } else if (window.faceapi.nets.tinyFaceDetector.isLoaded) {
  //         setFaceDetectionLoaded(true)
  //       }
  //     } catch (error) {
  //       console.error('Face API loading error:', error)
  //       setFaceDetectionLoaded(false)
  //     }
  //   }

  //   if (isActive) {
  //     loadFaceAPI()
  //   }
  // }, [isActive])
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
      tabSwitch: 5000, // 5 seconds
      fullscreenExit: 3000, // 3 seconds
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

  // const handleViolation = useCallback(
  //   (type, message) => {
  //     // Don't trigger violations if monitoring is paused or not active
  //     if (
  //       !isActive ||
  //       isMonitoringPaused ||
  //       !initialStateRef.current.setupComplete
  //     ) {
  //       return
  //     }

  //     // Check cooldown to prevent double counting
  //     if (!canTriggerViolation(type)) {
  //       return
  //     }

  //     console.log(`Violation triggered: ${type} - ${message}`)

  //     // Only update local state for display, don't call onViolation multiple times
  //     setViolations(prev => {
  //       const newViolations = { ...prev, [type]: prev[type] + 1 }

  //       // Call onViolation only once with proper delay
  //       setTimeout(() => {
  //         if (isActive && !isMonitoringPaused) {
  //           const totalViolations = Object.values(newViolations).reduce(
  //             (a, b) => a + b,
  //             0
  //           )
  //           onViolation({ type, message, totalViolations })
  //         }
  //       }, 100)

  //       return newViolations
  //     })
  //   },
  //   [isActive, isMonitoringPaused, onViolation, canTriggerViolation]
  // )

  // Real face detection function

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
      .detectAllFaces(video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.6 }))
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



  // Initialize Camera with better error handling
  // useEffect(() => {
  //   if (!isActive) return

  //   const initializeCamera = async () => {
  //     try {
  //       // Temporarily pause monitoring during camera setup
  //       setIsMonitoringPaused(true)

  //       const stream = await navigator.mediaDevices.getUserMedia({
  //         video: {
  //           width: { ideal: 640 },
  //           height: { ideal: 480 },
  //           facingMode: 'user'
  //         }
  //       })

  //       if (videoRef.current && stream) {
  //         videoRef.current.srcObject = stream
  //         await videoRef.current.play()
  //         streamRef.current = stream
  //         setCameraActive(true)

  //         // Wait for video to be ready before starting face detection
  //         videoRef.current.onloadedmetadata = () => {
  //           // Start face detection after camera is ready
  //           if (faceDetectionLoaded) {
  //             faceCheckIntervalRef.current = setInterval(detectFaces, 2000) // Check every 2 seconds
  //           }
  //         }

  //         // Setup complete after camera initialization
  //         setTimeout(() => {
  //           setIsMonitoringPaused(false)
  //           initialStateRef.current.setupComplete = true
  //           console.log('AntiCheat monitoring setup complete')
  //         }, 2000)
  //       }
  //     } catch (error) {
  //       console.error('Camera access denied:', error)
  //       setCameraActive(false)

  //       // Only report camera error once and only if it's a real denial
  //       if (error.name === 'NotAllowedError') {
  //         setTimeout(() => {
  //           handleViolation(
  //             'faceDetection',
  //             'Camera access denied - required for exam monitoring'
  //           )
  //         }, 3000)
  //       }

  //       // Still complete setup even without camera
  //       setTimeout(() => {
  //         setIsMonitoringPaused(false)
  //         initialStateRef.current.setupComplete = true
  //       }, 1000)
  //     }
  //   }

  //   initializeCamera()

  //   return () => {
  //     if (faceCheckIntervalRef.current) {
  //       clearInterval(faceCheckIntervalRef.current)
  //       faceCheckIntervalRef.current = null
  //     }
  //     if (streamRef.current) {
  //       streamRef.current.getTracks().forEach(track => track.stop())
  //       streamRef.current = null
  //       setCameraActive(false)
  //     }
  //   }
  // }, [isActive, faceDetectionLoaded])

  useEffect(() => {
  if (!isActive) return;

  const initializeCamera = async () => {
    try {
      // Pause monitoring while camera is setting up
      setIsMonitoringPaused(true);

      // 🔹 Stop any existing streams before opening a new one
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      });

      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        // Play video safely
        await videoRef.current.play().catch(err => {
          console.warn("⚠️ Video play interrupted:", err);
        });

        setCameraActive(true);

        // Wait for video metadata (dimensions) before detection
        videoRef.current.onloadedmetadata = () => {
          if (faceDetectionLoaded && !faceCheckIntervalRef.current) {
            faceCheckIntervalRef.current = setInterval(detectFaces, 2000); // every 2 sec
          }
        };

        // Mark setup complete
        setTimeout(() => {
          setIsMonitoringPaused(false);
          initialStateRef.current.setupComplete = true;
          console.log("✅ AntiCheat monitoring setup complete");
        }, 2000);
      }
    } catch (error) {
      console.error("❌ Camera access denied:", error);
      setCameraActive(false);

      if (error.name === "NotAllowedError") {
        setTimeout(() => {
          handleViolation(
            "faceDetection",
            "Camera access denied - required for exam monitoring"
          );
        }, 3000);
      }

      // Complete setup even if no camera
      setTimeout(() => {
        setIsMonitoringPaused(false);
        initialStateRef.current.setupComplete = true;
      }, 1000);
    }
  };

  initializeCamera();

  return () => {
    // 🔹 Cleanup on unmount
    if (faceCheckIntervalRef.current) {
      clearInterval(faceCheckIntervalRef.current);
      faceCheckIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };
}, [isActive, faceDetectionLoaded]);

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
        handleViolation('copyPaste', 'Developer tools access blocked')
        return
      }

      if (
        cmdKey &&
        e.shiftKey &&
        ['i', 'j', 'c'].includes(key?.toLowerCase())
      ) {
        e.preventDefault()
        handleViolation('copyPaste', 'Developer tools shortcut blocked')
        return
      }

      // Block refresh
      if (
        (cmdKey && key?.toLowerCase() === 'r') ||
        key === 'F5' ||
        keyCode === 116
      ) {
        e.preventDefault()
        handleViolation('copyPaste', 'Page refresh blocked during exam')
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
