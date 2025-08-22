// import React, { useState } from 'react'
// import { useAuth } from '@contexts/AuthContext'
// import { Navigate } from 'react-router-dom'
// import Button from '@components/common/Button'
// import Input from '@components/common/Input'
// import Alert from '@components/common/Alert'
// import { Eye, EyeOff, Shield } from 'lucide-react'

// const LoginPage = () => {
//   const [credentials, setCredentials] = useState({ username: '', password: '' })
//   const [showPassword, setShowPassword] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
  
//   const { login, user } = useAuth()

//   // If already logged in, redirect
//   if (user) {
//     return <Navigate to="/" replace />
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     e.stopPropagation()
    
//     if (loading) return
    
//     setLoading(true)
//     setError('')

//     try {
//       const result = await login(credentials.username, credentials.password)
//       if (!result.success) {
//         setError(result.message)
//       }
//       // If successful, the AuthContext will handle the redirect
//     } catch (error) {
//       console.error('Login error:', error)
//       setError('An unexpected error occurred. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleInputChange = (field, value) => {
//     setCredentials(prev => ({ ...prev, [field]: value }))
//     if (error) setError('') // Clear error when user types
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
//       <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
//         <div className="p-8">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
//               <Shield className="w-8 h-8 text-white" />
//             </div>
//             <h1 className="text-3xl font-bold text-white">Secure Exam System</h1>
//             <p className="text-white/80 mt-2">Sign in to your account</p>
//           </div>

//           {/* Login Form */}
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-white mb-1">
//                 Username
//               </label>
//               <input
//                 type="text"
//                 value={credentials.username}
//                 onChange={(e) => handleInputChange('username', e.target.value)}
//                 required
//                 disabled={loading}
//                 className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg shadow-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent disabled:opacity-50"
//                 placeholder="Enter your username"
//               />
//             </div>

//             <div className="relative">
//               <label className="block text-sm font-medium text-white mb-1">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   value={credentials.password}
//                   onChange={(e) => handleInputChange('password', e.target.value)}
//                   required
//                   disabled={loading}
//                   className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg shadow-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent pr-12 disabled:opacity-50"
//                   placeholder="Enter your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white disabled:opacity-50"
//                   disabled={loading}
//                 >
//                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                 </button>
//               </div>
//             </div>

//             {error && (
//               <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
//                 <p className="text-white text-sm">{error}</p>
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={loading || !credentials.username || !credentials.password}
//               className="w-full bg-white text-purple-700 hover:bg-white/90 font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? 'Signing In...' : 'Sign In'}
//             </button>
//           </form>

//           {/* Demo Credentials */}
//           {/* <div className="mt-8 p-4 bg-white/10 rounded-lg border border-white/20">
//             <h3 className="text-white font-semibold mb-3">Demo Credentials</h3>
//             <div className="space-y-2 text-sm text-white/80">
//               <div className="flex justify-between">
//                 <span>Admin:</span>
//                 <span className="font-mono">admin / admin</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Student:</span>
//                 <span className="font-mono">student / student</span>
//               </div>
//             </div>
//             <p className="text-xs text-white/60 mt-2">
//               Use these credentials to explore the system
//             </p>
//           </div> */}

//           {/* Features */}
//           <div className="mt-6 text-center">
//             <p className="text-white/60 text-sm">
//               Advanced anti-cheating • Real-time monitoring • Secure exams
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default LoginPage

// // import React, { useState } from 'react'
// // import { useAuth } from '@contexts/AuthContext'
// // import { Navigate } from 'react-router-dom'
// // import Button from '@components/common/Button'
// // import Input from '@components/common/Input'
// // import Alert from '@components/common/Alert'
// // import { Eye, EyeOff, Shield, Lock, Award, Monitor } from 'lucide-react'

// // const LoginPage = () => {
// //   const [credentials, setCredentials] = useState({ username: '', password: '' })
// //   const [showPassword, setShowPassword] = useState(false)
// //   const [loading, setLoading] = useState(false)
// //   const [error, setError] = useState('')
  
// //   const { login, user } = useAuth()

// //   // If already logged in, redirect
// //   if (user) {
// //     return <Navigate to="/" replace />
// //   }

// //   const handleSubmit = async (e) => {
// //     e.preventDefault()
// //     e.stopPropagation()
    
// //     if (loading) return
    
// //     setLoading(true)
// //     setError('')

// //     try {
// //       const result = await login(credentials.username, credentials.password)
// //       if (!result.success) {
// //         setError(result.message)
// //       }
// //       // If successful, the AuthContext will handle the redirect
// //     } catch (error) {
// //       console.error('Login error:', error)
// //       setError('An unexpected error occurred. Please try again.')
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const handleInputChange = (field, value) => {
// //     setCredentials(prev => ({ ...prev, [field]: value }))
// //     if (error) setError('') // Clear error when user types
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// //       <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
// //         {/* Left side - Branding and information */}
// //         <div className="w-full md:w-2/5 bg-white p-8 text-gray-800 flex flex-col justify-center border-r border-gray-100">
// //           <div className="mb-8">
// //             <div className="flex items-center mb-6">
// //               <div className="bg-indigo-100 p-3 rounded-full mr-3">
// //                 <Shield className="w-8 h-8 text-indigo-600" />
// //               </div>
// //               <h1 className="text-2xl font-bold text-gray-900">Exam Portal</h1>
// //             </div>
// //             <p className="text-md text-gray-600 mb-6 italic">
// //               "Where integrity meets innovation in assessment"
// //             </p>
// //             <p className="text-gray-500 text-sm">
// //               Our secure examination platform ensures fair and monitored testing environments for all users.
// //             </p>
// //           </div>
          
// //           <div className="space-y-4 mt-8">
// //             <div className="flex items-center">
// //               <div className="bg-indigo-100 p-2 rounded-full mr-3">
// //                 <Lock className="w-5 h-5 text-indigo-600" />
// //               </div>
// //               <span className="text-sm text-gray-600">Bank-grade security protocols</span>
// //             </div>
// //             <div className="flex items-center">
// //               <div className="bg-indigo-100 p-2 rounded-full mr-3">
// //                 <Monitor className="w-5 h-5 text-indigo-600" />
// //               </div>
// //               <span className="text-sm text-gray-600">Real-time proctoring & monitoring</span>
// //             </div>
// //             <div className="flex items-center">
// //               <div className="bg-indigo-100 p-2 rounded-full mr-3">
// //                 <Award className="w-5 h-5 text-indigo-600" />
// //               </div>
// //               <span className="text-sm text-gray-600">Industry-leading integrity assurance</span>
// //             </div>
// //           </div>
// //         </div>
        
// //         {/* Right side - Login Form */}
// //         <div className="w-full md:w-3/5 p-8 bg-white">
// //           <div className="text-center mb-8">
// //             <h2 className="text-xl font-semibold text-gray-800">Welcome Back</h2>
// //             <p className="text-gray-500 mt-2 text-sm">Sign in to access your exam dashboard</p>
// //           </div>

// //           <form onSubmit={handleSubmit} className="space-y-5">
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-2">
// //                 Username
// //               </label>
// //               <input
// //                 type="text"
// //                 value={credentials.username}
// //                 onChange={(e) => handleInputChange('username', e.target.value)}
// //                 required
// //                 disabled={loading}
// //                 className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 transition-colors"
// //                 placeholder="Enter your username"
// //               />
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-2">
// //                 Password
// //               </label>
// //               <div className="relative">
// //                 <input
// //                   type={showPassword ? 'text' : 'password'}
// //                   value={credentials.password}
// //                   onChange={(e) => handleInputChange('password', e.target.value)}
// //                   required
// //                   disabled={loading}
// //                   className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-12 disabled:opacity-50 transition-colors"
// //                   placeholder="Enter your password"
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowPassword(!showPassword)}
// //                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
// //                   disabled={loading}
// //                 >
// //                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
// //                 </button>
// //               </div>
// //             </div>

// //             {error && (
// //               <div className="bg-red-50 border border-red-200 rounded-md p-3">
// //                 <p className="text-red-700 text-sm">{error}</p>
// //               </div>
// //             )}

// //             <button
// //               type="submit"
// //               disabled={loading || !credentials.username || !credentials.password}
// //               className="w-full bg-indigo-600 text-white hover:bg-indigo-700 font-medium py-2.5 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
// //             >
// //               {loading ? (
// //                 <>
// //                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// //                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// //                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// //                   </svg>
// //                   Signing In...
// //                 </>
// //               ) : 'Sign In'}
// //             </button>
// //           </form>

// //           {/* Demo Credentials */}
// //           <div className="mt-8 p-4 bg-gray-50 rounded-md border border-gray-200">
// //             <h3 className="text-gray-800 font-medium mb-3 flex items-center text-sm">
// //               <span className="bg-indigo-100 text-indigo-800 p-1 rounded mr-2">
// //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
// //                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
// //                 </svg>
// //               </span>
// //               Demo Credentials
// //             </h3>
// //             <div className="space-y-2 text-xs text-gray-600">
// //               <div className="flex justify-between">
// //                 <span>Admin Account:</span>
// //                 <span className="font-mono bg-gray-100 px-2 py-1 rounded">admin / admin</span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span>Student Account:</span>
// //                 <span className="font-mono bg-gray-100 px-2 py-1 rounded">student / student</span>
// //               </div>
// //             </div>
// //             <p className="text-xs text-gray-500 mt-3">
// //               Use these credentials to explore the system features and capabilities
// //             </p>
// //           </div>

// //           {/* Footer note */}
// //           <div className="mt-6 text-center">
// //             <p className="text-gray-400 text-xs">
// //               Secure Exam System v2.0 • Advanced anti-cheating protection
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default LoginPage

import React, { useState } from 'react'
import { useAuth } from '@contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import { Eye, EyeOff, Shield, Lock, Monitor, Award } from 'lucide-react'

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login, user } = useAuth()

  // If already logged in, redirect
  if (user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (loading) return
    
    setLoading(true)
    setError('')

    try {
      const result = await login(credentials.username, credentials.password)
      if (!result.success) {
        setError(result.message)
      }
      // If successful, the AuthContext will handle the redirect
    } catch (error) {
      console.error('Login error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setCredentials(prev => ({ ...prev, [field]: value }))
    if (error) setError('') // Clear error when user types
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        {/* Left side - Branding and information */}
        <div className="w-full md:w-2/5 bg-indigo-600 p-8 text-white flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-white/20 p-3 rounded-full mr-3">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Secure Exam System</h1>
            </div>
            <p className="text-md text-white/90 mb-6 italic">
              "Where integrity meets innovation in assessment"
            </p>
            <p className="text-white/80 text-sm">
              Our secure examination platform ensures fair and monitored testing environments for all users.
            </p>
          </div>
          
          {/* <div className="space-y-4 mt-8">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-3">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-white/90">Bank-grade security protocols</span>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-3">
                <Monitor className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-white/90">Real-time proctoring & monitoring</span>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-3">
                <Award className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-white/90">Industry-leading integrity assurance</span>
            </div>
          </div> */}
        </div>
        
        {/* Right side - Login Form */}
        <div className="w-full md:w-3/5 p-8 bg-white">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 mt-2">Sign in to access your exam dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 transition-colors"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-12 disabled:opacity-50 transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !credentials.username || !credentials.password}
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials
          <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <h3 className="text-indigo-800 font-medium mb-3 flex items-center">
              <span className="bg-indigo-200 text-indigo-800 p-1 rounded mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
              </span>
              Demo Credentials
            </h3>
            <div className="space-y-2 text-sm text-indigo-700">
              <div className="flex justify-between">
                <span>Admin Account:</span>
                <span className="font-mono bg-indigo-100 px-2 py-1 rounded">admin / admin</span>
              </div>
              <div className="flex justify-between">
                <span>Student Account:</span>
                <span className="font-mono bg-indigo-100 px-2 py-1 rounded">student / student</span>
              </div>
            </div>
            <p className="text-xs text-indigo-600/80 mt-3">
              Use these credentials to explore the system features and capabilities
            </p>
          </div> */}

          {/* Footer note */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-xs">
              Secure Exam System v2.0 • Advanced anti-cheating protection
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage