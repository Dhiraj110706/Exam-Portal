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
//   const videoRef = useRef(null)
//   const streamRef = useRef(null)

//   const handleViolation = useCallback((type, message) => {
//     const newViolations = { ...violations, [type]: violations[type] + 1 }
//     setViolations(newViolations)
    
//     const totalViolations = Object.values(newViolations).reduce((a, b) => a + b, 0)
//     onViolation({ type, message, totalViolations })
//   }, [violations, onViolation])

//   // Initialize Camera
//   useEffect(() => {
//     if (!isActive) return

//     const initializeCamera = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ 
//           video: { width: 320, height: 240 } 
//         })
        
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream
//           videoRef.current.play()
//           streamRef.current = stream
//           setCameraActive(true)

//           // Simulate face detection (in real implementation, use MediaPipe)
//           const faceCheckInterval = setInterval(() => {
//             if (Math.random() < 0.05) { // 5% chance of face not detected
//               handleViolation('faceDetection', VIOLATION_MESSAGES[VIOLATION_TYPES.FACE_NOT_DETECTED])
//             }
//           }, 10000) // Check every 10 seconds

//           return () => {
//             clearInterval(faceCheckInterval)
//           }
//         }
//       } catch (error) {
//         console.error('Camera access denied:', error)
//         handleViolation('faceDetection', 'Camera access denied')
//       }
//     }

//     initializeCamera()

//     return () => {
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach(track => track.stop())
//       }
//     }
//   }, [isActive, handleViolation])

//   // Tab Switch Detection
//   useEffect(() => {
//     if (!isActive) return

//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         handleViolation('tabSwitch', VIOLATION_MESSAGES[VIOLATION_TYPES.TAB_SWITCH])
//       }
//     }

//     document.addEventListener('visibilitychange', handleVisibilityChange)
//     return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
//   }, [isActive, handleViolation])

//   // Fullscreen Exit Detection
//   useEffect(() => {
//     if (!isActive) return

//     const handleFullscreenChange = () => {
//       if (!document.fullscreenElement) {
//         handleViolation('fullscreenExit', VIOLATION_MESSAGES[VIOLATION_TYPES.FULLSCREEN_EXIT])
//       }
//     }

//     document.addEventListener('fullscreenchange', handleFullscreenChange)
//     return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
//   }, [isActive, handleViolation])

//   // Copy/Paste/Right-click Prevention
//   useEffect(() => {
//     if (!isActive) return

//     const preventCopyPaste = (e) => {
//       if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a')) {
//         e.preventDefault()
//         handleViolation('copyPaste', VIOLATION_MESSAGES[VIOLATION_TYPES.COPY_PASTE])
//       }
      
//       // Block other shortcuts
//       if (e.altKey && e.key === 'Tab') {
//         e.preventDefault()
//         handleViolation('copyPaste', VIOLATION_MESSAGES[VIOLATION_TYPES.KEYBOARD_SHORTCUT])
//       }
      
//       if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
//         e.preventDefault()
//         handleViolation('copyPaste', 'Developer tools blocked')
//       }
//     }

//     const preventContextMenu = (e) => {
//       e.preventDefault()
//       handleViolation('rightClick', VIOLATION_MESSAGES[VIOLATION_TYPES.RIGHT_CLICK])
//     }

//     const preventDrag = (e) => {
//       e.preventDefault()
//     }

//     const preventSelect = (e) => {
//       if (e.ctrlKey) {
//         e.preventDefault()
//       }
//     }

//     document.addEventListener('keydown', preventCopyPaste)
//     document.addEventListener('contextmenu', preventContextMenu)
//     document.addEventListener('dragstart', preventDrag)
//     document.addEventListener('selectstart', preventSelect)

//     return () => {
//       document.removeEventListener('keydown', preventCopyPaste)
//       document.removeEventListener('contextmenu', preventContextMenu)
//       document.removeEventListener('dragstart', preventDrag)
//       document.removeEventListener('selectstart', preventSelect)
//     }
//   }, [isActive, handleViolation])

//   if (!isActive) return null

//   const totalViolations = Object.values(violations).reduce((a, b) => a + b, 0)

//   return (
//     <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 min-w-[280px]">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-3">
//         <div className="flex items-center">
//           <Shield className="w-5 h-5 text-blue-600 mr-2" />
//           <span className="font-semibold text-gray-800">Security Monitor</span>
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

//       {/* Camera Feed */}
//       <div className="mb-3">
//         <div className="flex items-center mb-2">
//           <Camera className="w-4 h-4 text-gray-600 mr-2" />
//           <span className="text-sm text-gray-600">Camera Monitor</span>
//           <div className={`ml-auto w-2 h-2 rounded-full ${
//             cameraActive ? 'bg-green-500' : 'bg-red-500'
//           }`}></div>
//         </div>
//         <video
//           ref={videoRef}
//           className="w-full h-20 bg-gray-200 rounded border object-cover"
//           muted
//           playsInline
//         />
//       </div>

//       {/* Violation Counters */}
//       <div className="space-y-1 text-xs">
//         <div className="flex justify-between">
//           <span className="text-gray-600">Tab Switch:</span>
//           <span className="font-medium">{violations.tabSwitch}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-600">Fullscreen Exit:</span>
//           <span className="font-medium">{violations.fullscreenExit}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-600">Copy/Paste:</span>
//           <span className="font-medium">{violations.copyPaste}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-600">Face Issues:</span>
//           <span className="font-medium">{violations.faceDetection}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-600">Right Click:</span>
//           <span className="font-medium">{violations.rightClick}</span>
//         </div>
//       </div>

//       {/* Warning */}
//       {totalViolations > 0 && (
//         <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
//           <div className="flex items-center text-yellow-800">
//             <AlertTriangle className="w-3 h-3 mr-1" />
//             <span className="font-medium">Security Alert</span>
//           </div>
//           <p className="text-yellow-700 mt-1">
//             Violations detected. Exam may auto-submit at limit.
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
  
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const faceCheckIntervalRef = useRef(null)
  const violationCooldownRef = useRef({})
  const lastViolationTimeRef = useRef({})

  // Debounce function to prevent rapid violations
  const debounceViolation = useCallback((type, delay = 2000) => {
    const now = Date.now()
    const lastTime = violationCooldownRef.current[type] || 0
    
    if (now - lastTime < delay) {
      return false // Skip this violation due to cooldown
    }
    
    violationCooldownRef.current[type] = now
    return true
  }, [])

  const handleViolation = useCallback((type, message) => {
    // Prevent rapid-fire violations
    if (!debounceViolation(type)) {
      return
    }

    setViolations(prev => {
      const newViolations = { ...prev, [type]: prev[type] + 1 }
      const totalViolations = Object.values(newViolations).reduce((a, b) => a + b, 0)
      
      // Call onViolation with a small delay to prevent blocking UI
      setTimeout(() => {
        onViolation({ type, message, totalViolations })
      }, 50)
      
      return newViolations
    })

    lastViolationTimeRef.current[type] = Date.now()
  }, [onViolation, debounceViolation])

  // Initialize Camera with better error handling
  useEffect(() => {
    if (!isActive) return

    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 320 }, 
            height: { ideal: 240 },
            facingMode: 'user'
          } 
        })
        
        if (videoRef.current && stream) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          streamRef.current = stream
          setCameraActive(true)

          // More reasonable face detection simulation
          faceCheckIntervalRef.current = setInterval(() => {
            // Reduced probability and better logic
            if (Math.random() < 0.01) { // 1% chance every 20 seconds
              handleViolation('faceDetection', VIOLATION_MESSAGES[VIOLATION_TYPES.FACE_NOT_DETECTED])
            }
          }, 20000) // Check every 20 seconds
        }
      } catch (error) {
        console.error('Camera access denied:', error)
        setCameraActive(false)
        // Only report camera error once
        handleViolation('faceDetection', 'Camera access denied - required for exam monitoring')
      }
    }

    initializeCamera()

    return () => {
      if (faceCheckIntervalRef.current) {
        clearInterval(faceCheckIntervalRef.current)
        faceCheckIntervalRef.current = null
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
        setCameraActive(false)
      }
    }
  }, [isActive, handleViolation])

  // Improved Tab Switch Detection
  useEffect(() => {
    if (!isActive) return

    let wasVisible = !document.hidden
    
    const handleVisibilityChange = () => {
      const isCurrentlyHidden = document.hidden
      
      // Only trigger if tab becomes hidden AND we were previously visible
      if (isCurrentlyHidden && wasVisible) {
        handleViolation('tabSwitch', VIOLATION_MESSAGES[VIOLATION_TYPES.TAB_SWITCH])
      }
      
      wasVisible = !isCurrentlyHidden
    }

    const handleBlur = () => {
      // Small delay to check if it's actually a tab switch
      setTimeout(() => {
        if (document.hidden && !document.fullscreenElement) {
          handleViolation('tabSwitch', 'Window focus lost')
        }
      }, 200)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
    }
  }, [isActive, handleViolation])

  // Improved Fullscreen Detection
  useEffect(() => {
    if (!isActive) return

    // Set initial fullscreen state
    setIsInFullscreen(!!document.fullscreenElement)

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement
      
      // Only trigger violation if we exit fullscreen after being in fullscreen
      if (isInFullscreen && !isCurrentlyFullscreen) {
        handleViolation('fullscreenExit', VIOLATION_MESSAGES[VIOLATION_TYPES.FULLSCREEN_EXIT])
      }
      
      setIsInFullscreen(isCurrentlyFullscreen)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange) // Safari
    document.addEventListener('mozfullscreenchange', handleFullscreenChange) // Firefox
    document.addEventListener('MSFullscreenChange', handleFullscreenChange) // IE/Edge
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [isActive, handleViolation, isInFullscreen])

  // Improved Keyboard and Mouse Event Prevention
  useEffect(() => {
    if (!isActive) return

    const preventCopyPaste = (e) => {
      const { ctrlKey, metaKey, key, keyCode } = e
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const cmdKey = isMac ? metaKey : ctrlKey

      // Block copy, paste, cut, select all
      if (cmdKey && ['c', 'v', 'x', 'a'].includes(key?.toLowerCase())) {
        e.preventDefault()
        handleViolation('copyPaste', VIOLATION_MESSAGES[VIOLATION_TYPES.COPY_PASTE])
        return
      }
      
      // Block Alt+Tab (Windows/Linux)
      if (e.altKey && key === 'Tab') {
        e.preventDefault()
        handleViolation('copyPaste', VIOLATION_MESSAGES[VIOLATION_TYPES.KEYBOARD_SHORTCUT])
        return
      }
      
      // Block Cmd+Tab (Mac)
      if (isMac && metaKey && key === 'Tab') {
        e.preventDefault()
        handleViolation('copyPaste', VIOLATION_MESSAGES[VIOLATION_TYPES.KEYBOARD_SHORTCUT])
        return
      }
      
      // Block F12 and Developer Tools shortcuts
      if (key === 'F12' || keyCode === 123) {
        e.preventDefault()
        handleViolation('copyPaste', 'Developer tools access blocked')
        return
      }
      
      if (cmdKey && e.shiftKey && ['i', 'j', 'c'].includes(key?.toLowerCase())) {
        e.preventDefault()
        handleViolation('copyPaste', 'Developer tools shortcut blocked')
        return
      }

      // Block refresh
      if ((cmdKey && key?.toLowerCase() === 'r') || key === 'F5' || keyCode === 116) {
        e.preventDefault()
        handleViolation('copyPaste', 'Page refresh blocked during exam')
        return
      }

      // Block Escape key (potential fullscreen exit)
      if (key === 'Escape' && document.fullscreenElement) {
        e.preventDefault()
        return
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
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
      }
    }

    // Add event listeners
    document.addEventListener('keydown', preventCopyPaste)
    document.addEventListener('contextmenu', preventContextMenu)
    document.addEventListener('dragstart', preventDrag)
    document.addEventListener('selectstart', preventSelect)

    // Disable text selection via CSS
    const originalUserSelect = document.body.style.userSelect
    const originalWebkitUserSelect = document.body.style.webkitUserSelect
    const originalMsUserSelect = document.body.style.msUserSelect
    
    document.body.style.userSelect = 'none'
    document.body.style.webkitUserSelect = 'none'
    document.body.style.msUserSelect = 'none'

    return () => {
      document.removeEventListener('keydown', preventCopyPaste)
      document.removeEventListener('contextmenu', preventContextMenu)
      document.removeEventListener('dragstart', preventDrag)
      document.removeEventListener('selectstart', preventSelect)
      
      // Restore original styles
      document.body.style.userSelect = originalUserSelect
      document.body.style.webkitUserSelect = originalWebkitUserSelect
      document.body.style.msUserSelect = originalMsUserSelect
    }
  }, [isActive, handleViolation])

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (faceCheckIntervalRef.current) {
        clearInterval(faceCheckIntervalRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

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

      {/* Status Indicators */}
      <div className="mb-3 text-xs space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Fullscreen:</span>
          <span className={`font-medium ${isInFullscreen ? 'text-green-600' : 'text-red-600'}`}>
            {isInFullscreen ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Camera:</span>
          <span className={`font-medium ${cameraActive ? 'text-green-600' : 'text-red-600'}`}>
            {cameraActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Camera Feed */}
      <div className="mb-3">
        <div className="flex items-center mb-2">
          <Camera className="w-4 h-4 text-gray-600 mr-2" />
          <span className="text-sm text-gray-600">Camera Monitor</span>
          <div className={`ml-auto w-2 h-2 rounded-full ${
            cameraActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`}></div>
        </div>
        <video
          ref={videoRef}
          className="w-full h-20 bg-gray-200 rounded border object-cover"
          muted
          playsInline
          style={{ transform: 'scaleX(-1)' }} // Mirror the video
        />
      </div>

      {/* Violation Counters */}
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600">Tab Switch:</span>
          <span className={`font-medium ${violations.tabSwitch > 0 ? 'text-red-600' : 'text-gray-800'}`}>
            {violations.tabSwitch}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Fullscreen Exit:</span>
          <span className={`font-medium ${violations.fullscreenExit > 0 ? 'text-red-600' : 'text-gray-800'}`}>
            {violations.fullscreenExit}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Copy/Paste:</span>
          <span className={`font-medium ${violations.copyPaste > 0 ? 'text-red-600' : 'text-gray-800'}`}>
            {violations.copyPaste}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Face Issues:</span>
          <span className={`font-medium ${violations.faceDetection > 0 ? 'text-red-600' : 'text-gray-800'}`}>
            {violations.faceDetection}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Right Click:</span>
          <span className={`font-medium ${violations.rightClick > 0 ? 'text-red-600' : 'text-gray-800'}`}>
            {violations.rightClick}
          </span>
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
            {totalViolations} violation{totalViolations !== 1 ? 's' : ''} detected. Exam may auto-submit at limit.
          </p>
        </div>
      )}
    </div>
  )
}

export default AntiCheatMonitor