// import React from 'react'

// const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
//   const sizeClasses = {
//     small: 'h-6 w-6',
//     medium: 'h-12 w-12',
//     large: 'h-16 w-16'
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//       <div className="text-center">
//         <div className={`animate-spin rounded-full border-b-2 border-primary-600 mx-auto mb-4 ${sizeClasses[size]}`}></div>
//         <p className="text-gray-600">{message}</p>
//       </div>
//     </div>
//   )
// }

// export default LoadingSpinner

import React from 'react'
import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  fullScreen = false,
  className = '', 
  type = 'icon' // "icon" uses Loader2, "border" uses CSS border spinner
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const borderSizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  const SpinnerIcon = () => (
    <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-600 mx-auto mb-4`} />
  )

  const SpinnerBorder = () => (
    <div className={`animate-spin rounded-full border-b-2 border-primary-600 mx-auto mb-4 ${borderSizeClasses[size]}`} />
  )

  const spinner = type === 'border' ? <SpinnerBorder /> : <SpinnerIcon />

  const Container = ({ children }) =>
    fullScreen ? (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        {children}
      </div>
    ) : (
      <div className={`flex items-center justify-center ${className}`}>
        {children}
      </div>
    )

  return (
    <Container>
      <div className="text-center">
        {spinner}
        {text && <p className={`${textSizeClasses[size]} text-gray-600`}>{text}</p>}
      </div>
    </Container>
  )
}

export default LoadingSpinner
