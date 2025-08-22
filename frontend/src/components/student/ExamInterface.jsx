// // import React, { useState, useEffect } from 'react'
// // import { Clock, AlertTriangle, CheckCircle } from 'lucide-react'
// // import Button from '@components/common/Button'
// // import Card from '@components/common/Card'
// // import { formatTime } from '@utils/helpers'
// // import { useExam } from '@hooks/useExam'
// // import AntiCheatMonitor from '@components/student/AntiCheatMonitor'

// // const ExamInterface = ({ exam, user, onExamComplete }) => {
// //   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
// //   const [answers, setAnswers] = useState({})
// //   const [timeLeft, setTimeLeft] = useState(exam.duration_minutes * 60)
// //   const [violations, setViolations] = useState([])
// //   const [startTime] = useState(new Date().toISOString())
  
// //   const { submitExam, loading: submitting } = useExam()
// //   const currentQuestion = exam.questions[currentQuestionIndex]

// //   // Timer
// //   useEffect(() => {
// //     const timer = setInterval(() => {
// //       setTimeLeft(prev => {
// //         if (prev <= 1) {
// //           handleSubmitExam(true) // Auto submit on timeout
// //           return 0
// //         }
// //         return prev - 1
// //       })
// //     }, 1000)

// //     return () => clearInterval(timer)
// //   }, [])

// //   const handleViolation = ({ type, message, totalViolations }) => {
// //     const violation = {
// //       type,
// //       message,
// //       timestamp: new Date().toISOString()
// //     }
    
// //     const newViolations = [...violations, violation]
// //     setViolations(newViolations)

// //     // Show violation alert
// //     alert(`Security Violation: ${message}\nTotal violations: ${totalViolations}/${exam.max_violations}`)

// //     if (totalViolations >= exam.max_violations) {
// //       handleSubmitExam(true) // Auto submit on max violations
// //     }
// //   }

// //   const handleAnswerChange = (questionId, answer) => {
// //     setAnswers(prev => ({
// //       ...prev,
// //       [questionId]: answer
// //     }))
// //   }

// //   const nextQuestion = () => {
// //     if (currentQuestionIndex < exam.questions.length - 1) {
// //       setCurrentQuestionIndex(prev => prev + 1)
// //     }
// //   }

// //   const prevQuestion = () => {
// //     if (currentQuestionIndex > 0) {
// //       setCurrentQuestionIndex(prev => prev - 1)
// //     }
// //   }

// //   const goToQuestion = (index) => {
// //     setCurrentQuestionIndex(index)
// //   }

// //   const handleSubmitExam = async (autoSubmit = false) => {
// //     if (submitting) return
    
// //     if (!autoSubmit && !confirm('Are you sure you want to submit the exam?')) {
// //       return
// //     }

// //     const submissionData = {
// //       answers,
// //       violations_count: violations.length,
// //       violations_log: violations,
// //       cheated: violations.length > 0,
// //       time_taken: Math.floor((exam.duration_minutes * 60 - timeLeft) / 60),
// //       started_at: startTime
// //     }

// //     try {
// //       const result = await submitExam(exam.id, submissionData)
      
// //       // Exit fullscreen
// //       if (document.fullscreenElement) {
// //         document.exitFullscreen()
// //       }
      
// //       alert(`Exam submitted successfully!\nScore: ${result.score}%\nViolations: ${result.violations_count}`)
// //       onExamComplete()
// //     } catch (error) {
// //       alert('Failed to submit exam: ' + (error.response?.data?.error || error.message))
// //     }
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-100 no-select">
// //       {/* Anti-Cheat Monitor */}
// //       <AntiCheatMonitor onViolation={handleViolation} isActive={true} />

// //       {/* Exam Header */}
// //       <div className="bg-white shadow-sm border-b">
// //         <div className="px-6 py-4 flex justify-between items-center">
// //           <div>
// //             <h1 className="text-xl font-bold text-gray-800">{exam.title}</h1>
// //             <p className="text-gray-600">Student: {user.username} ({user.student_id})</p>
// //           </div>
// //           <div className="flex items-center space-x-6">
// //             <div className="text-right">
// //               <div className="text-sm text-gray-500">Time Remaining</div>
// //               <div className={`text-lg font-bold flex items-center ${
// //                 timeLeft < 300 ? 'text-red-600' : 'text-green-600'
// //               }`}>
// //                 <Clock className="w-5 h-5 mr-2" />
// //                 {formatTime(timeLeft)}
// //               </div>
// //             </div>
// //             <div className="text-right">
// //               <div className="text-sm text-gray-500">Violations</div>
// //               <div className={`text-lg font-bold flex items-center ${
// //                 violations.length >= exam.max_violations ? 'text-red-600' : 'text-orange-600'
// //               }`}>
// //                 <AlertTriangle className="w-5 h-5 mr-2" />
// //                 {violations.length}/{exam.max_violations}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Progress Bar */}
// //       <div className="bg-white border-b">
// //         <div className="px-6 py-3">
// //           <div className="flex justify-between items-center mb-2">
// //             <span className="text-sm text-gray-600">
// //               Question {currentQuestionIndex + 1} of {exam.questions.length}
// //             </span>
// //             <span className="text-sm text-gray-600">
// //               Answered: {Object.keys(answers).length}/{exam.questions.length}
// //             </span>
// //           </div>
// //           <div className="w-full bg-gray-200 rounded-full h-2">
// //             <div
// //               className="bg-primary-600 h-2 rounded-full transition-all duration-300"
// //               style={{
// //                 width: `${((currentQuestionIndex + 1) / exam.questions.length) * 100}%`
// //               }}
// //             />
// //           </div>
// //         </div>
// //       </div>

// //       {/* Main Content */}
// //       <div className="flex-1 p-6">
// //         <div className="max-w-4xl mx-auto">
// //           <Card className="question-card">
// //             <div className="p-8">
// //               {/* Question */}
// //               <div className="mb-8">
// //                 <div className="flex items-start justify-between mb-4">
// //                   <h2 className="text-xl font-bold text-gray-800 pr-4">
// //                     {currentQuestion.question_text}
// //                   </h2>
// //                   <div className="flex-shrink-0">
// //                     <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
// //                       Question {currentQuestionIndex + 1}
// //                     </span>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Options */}
// //               <div className="space-y-4 mb-8">
// //                 {['A', 'B', 'C', 'D'].map(option => (
// //                   <label
// //                     key={option}
// //                     className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
// //                       answers[currentQuestion.id] === option
// //                         ? 'border-primary-500 bg-primary-50'
// //                         : 'border-gray-200'
// //                     }`}
// //                   >
// //                     <input
// //                       type="radio"
// //                       name={`question-${currentQuestion.id}`}
// //                       value={option}
// //                       checked={answers[currentQuestion.id] === option}
// //                       onChange={() => handleAnswerChange(currentQuestion.id, option)}
// //                       className="mt-1 mr-4 h-4 w-4 text-primary-600"
// //                     />
// //                     <div className="flex-1">
// //                       <span className="font-medium text-gray-800 mr-3">{option})</span>
// //                       <span className="text-gray-700">
// //                         {currentQuestion[`option_${option.toLowerCase()}`]}
// //                       </span>
// //                     </div>
// //                     {answers[currentQuestion.id] === option && (
// //                       <CheckCircle className="w-5 h-5 text-primary-600 ml-2 mt-0.5" />
// //                     )}
// //                   </label>
// //                 ))}
// //               </div>

// //               {/* Navigation */}
// //               <div className="flex justify-between items-center">
// //                 <Button
// //                   onClick={prevQuestion}
// //                   disabled={currentQuestionIndex === 0}
// //                   variant="secondary"
// //                 >
// //                   Previous
// //                 </Button>

// //                 {/* Question Numbers */}
// //                 <div className="flex flex-wrap gap-2 max-w-md">
// //                   {exam.questions.map((_, index) => (
// //                     <button
// //                       key={index}
// //                       onClick={() => goToQuestion(index)}
// //                       className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
// //                         index === currentQuestionIndex
// //                           ? 'bg-primary-600 text-white'
// //                           : answers[exam.questions[index].id]
// //                           ? 'bg-green-500 text-white'
// //                           : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
// //                       }`}
// //                     >
// //                       {index + 1}
// //                     </button>
// //                   ))}
// //                 </div>

// //                 <div className="flex gap-2">
// //                   {currentQuestionIndex === exam.questions.length - 1 ? (
// //                     <Button
// //                       onClick={() => handleSubmitExam(false)}
// //                       loading={submitting}
// //                       variant="success"
// //                     >
// //                       Submit Exam
// //                     </Button>
// //                   ) : (
// //                     <Button onClick={nextQuestion}>
// //                       Next
// //                     </Button>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           </Card>

// //           {/* Submit Button (Always Visible) */}
// //           <div className="mt-6 text-center">
// //             <Button
// //               onClick={() => handleSubmitExam(false)}
// //               loading={submitting}
// //               variant="danger"
// //               size="large"
// //             >
// //               Submit Exam Early
// //             </Button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Violation Alerts */}
// //       {violations.length > 0 && (
// //         <div className="fixed bottom-4 left-4 bg-red-100 border border-red-400 rounded-lg p-4 max-w-sm violation-alert">
// //           <div className="text-red-800 font-bold">Recent Violations:</div>
// //           <div className="text-red-700 text-sm mt-1">
// //             {violations.slice(-3).map((v, i) => (
// //               <div key={i}>{v.message}</div>
// //             ))}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   )
// // }

// // export default ExamInterface
// import React, { useState, useEffect, useRef } from 'react'
// import { Clock, AlertTriangle, CheckCircle } from 'lucide-react'
// import Button from '@components/common/Button'
// import Card from '@components/common/Card'
// import { formatTime } from '@utils/helpers'
// import { useExam } from '@hooks/useExam'
// import AntiCheatMonitor from '@components/student/AntiCheatMonitor'

// const ExamInterface = ({ exam, user, onExamComplete }) => {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
//   const [answers, setAnswers] = useState({})
//   const [timeLeft, setTimeLeft] = useState(exam.duration_minutes * 60)
//   const [violations, setViolations] = useState([])
//   const [startTime] = useState(new Date().toISOString())
//   const [isExamEnded, setIsExamEnded] = useState(false)
//   const [lastViolationAlert, setLastViolationAlert] = useState(0)
  
//   const { submitExam, loading: submitting } = useExam()
//   const currentQuestion = exam.questions[currentQuestionIndex]
  
//   // Refs to prevent memory leaks and manage timers
//   const timerRef = useRef(null)
//   const violationTimeoutRef = useRef(null)
//   const alertCooldownRef = useRef(false)

//   // Timer with proper cleanup
//   useEffect(() => {
//     if (isExamEnded || submitting) return

//     timerRef.current = setInterval(() => {
//       setTimeLeft(prev => {
//         if (prev <= 1) {
//           handleSubmitExam(true, 'Time expired') // Auto submit on timeout
//           return 0
//         }
//         return prev - 1
//       })
//     }, 1000)

//     return () => {
//       if (timerRef.current) {
//         clearInterval(timerRef.current)
//       }
//     }
//   }, [isExamEnded, submitting])

//   // Cleanup on component unmount
//   useEffect(() => {
//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current)
//       if (violationTimeoutRef.current) clearTimeout(violationTimeoutRef.current)
//     }
//   }, [])

//   const showViolationAlert = (violationData) => {
//     const now = Date.now()
    
//     // Prevent showing alerts more than once every 5 seconds
//     if (now - lastViolationAlert < 5000 || alertCooldownRef.current) {
//       return
//     }
    
//     setLastViolationAlert(now)
//     alertCooldownRef.current = true
    
//     // Clear any existing timeout
//     if (violationTimeoutRef.current) {
//       clearTimeout(violationTimeoutRef.current)
//     }
    
//     // Show alert with timeout to prevent UI blocking
//     violationTimeoutRef.current = setTimeout(() => {
//       const message = `Security Violation: ${violationData.message}\nTotal violations: ${violationData.totalViolations}/${exam.max_violations}`
//       alert(message)
      
//       // Reset cooldown after alert is shown
//       setTimeout(() => {
//         alertCooldownRef.current = false
//       }, 2000)
//     }, 200)
//   }

//   const handleViolation = ({ type, message, totalViolations }) => {
//     if (isExamEnded || submitting) return

//     const violation = {
//       type,
//       message,
//       timestamp: new Date().toISOString()
//     }
    
//     setViolations(prev => {
//       const newViolations = [...prev, violation]
      
//       // Show alert for this violation (with cooldown)
//       showViolationAlert({
//         type,
//         message,
//         totalViolations: newViolations.length
//       })

//       // Check if we've exceeded max violations
//       if (newViolations.length >= exam.max_violations) {
//         // Delay auto-submit to allow violation processing
//         setTimeout(() => {
//           if (!isExamEnded && !submitting) {
//             handleSubmitExam(true, 'Maximum violations exceeded')
//           }
//         }, 1000)
//       }
      
//       return newViolations
//     })
//   }

//   const handleAnswerChange = (questionId, answer) => {
//     if (isExamEnded || submitting) return
    
//     setAnswers(prev => ({
//       ...prev,
//       [questionId]: answer
//     }))
//   }

//   const nextQuestion = () => {
//     if (currentQuestionIndex < exam.questions.length - 1 && !isExamEnded) {
//       setCurrentQuestionIndex(prev => prev + 1)
//     }
//   }

//   const prevQuestion = () => {
//     if (currentQuestionIndex > 0 && !isExamEnded) {
//       setCurrentQuestionIndex(prev => prev - 1)
//     }
//   }

//   const goToQuestion = (index) => {
//     if (!isExamEnded && index >= 0 && index < exam.questions.length) {
//       setCurrentQuestionIndex(index)
//     }
//   }

//   const handleSubmitExam = async (autoSubmit = false, reason = '') => {
//     if (submitting || isExamEnded) return
    
//     // Prevent multiple submissions
//     setIsExamEnded(true)
    
//     // Clear timer immediately
//     if (timerRef.current) {
//       clearInterval(timerRef.current)
//       timerRef.current = null
//     }

//     // Confirmation for manual submission
//     if (!autoSubmit) {
//       const confirmMessage = `Are you sure you want to submit the exam?\n\nAnswered: ${Object.keys(answers).length}/${exam.questions.length} questions\nTime remaining: ${formatTime(timeLeft)}`
//       if (!confirm(confirmMessage)) {
//         setIsExamEnded(false)
//         return
//       }
//     }

//     const submissionData = {
//       answers,
//       violations_count: violations.length,
//       violations_log: violations,
//       cheated: violations.length > 0,
//       time_taken: Math.floor((exam.duration_minutes * 60 - timeLeft) / 60),
//       started_at: startTime,
//       submission_reason: autoSubmit ? (reason || 'Auto-submitted') : 'Manual submission'
//     }

//     try {
//       const result = await submitExam(exam.id, submissionData)
      
//       // Exit fullscreen
//       if (document.fullscreenElement) {
//         try {
//           await document.exitFullscreen()
//         } catch (err) {
//           console.log('Could not exit fullscreen:', err)
//         }
//       }
      
//       const message = autoSubmit 
//         ? `Exam auto-submitted: ${reason}\n\nScore: ${result.score}%\nViolations: ${result.violations_count}`
//         : `Exam submitted successfully!\n\nScore: ${result.score}%\nViolations: ${result.violations_count}`
      
//       alert(message)
//       onExamComplete()
      
//     } catch (error) {
//       console.error('Submission error:', error)
//       alert('Failed to submit exam: ' + (error.response?.data?.error || error.message))
//       // Reset state on error to allow retry
//       setIsExamEnded(false)
//     }
//   }

//   if (!exam || !currentQuestion) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-gray-400 text-xl mb-4">Loading exam...</div>
//         </div>
//       </div>
//     )
//   }

//   const totalViolations = violations.length

//   return (
//     <div className="min-h-screen bg-gray-100 no-select">
//       {/* Anti-Cheat Monitor */}
//       <AntiCheatMonitor onViolation={handleViolation} isActive={!isExamEnded} />

//       {/* Exam Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="px-6 py-4 flex justify-between items-center">
//           <div>
//             <h1 className="text-xl font-bold text-gray-800">{exam.title}</h1>
//             <p className="text-gray-600">Student: {user.username} ({user.student_id})</p>
//           </div>
//           <div className="flex items-center space-x-6">
//             <div className="text-right">
//               <div className="text-sm text-gray-500">Time Remaining</div>
//               <div className={`text-lg font-bold flex items-center ${
//                 timeLeft < 300 ? 'text-red-600' : 'text-green-600'
//               }`}>
//                 <Clock className="w-5 h-5 mr-2" />
//                 {formatTime(timeLeft)}
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="text-sm text-gray-500">Violations</div>
//               <div className={`text-lg font-bold flex items-center ${
//                 totalViolations >= exam.max_violations ? 'text-red-600' : 'text-orange-600'
//               }`}>
//                 <AlertTriangle className="w-5 h-5 mr-2" />
//                 {totalViolations}/{exam.max_violations}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Progress Bar */}
//       <div className="bg-white border-b">
//         <div className="px-6 py-3">
//           <div className="flex justify-between items-center mb-2">
//             <span className="text-sm text-gray-600">
//               Question {currentQuestionIndex + 1} of {exam.questions.length}
//             </span>
//             <span className="text-sm text-gray-600">
//               Answered: {Object.keys(answers).length}/{exam.questions.length}
//             </span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div
//               className="bg-primary-600 h-2 rounded-full transition-all duration-300"
//               style={{
//                 width: `${((currentQuestionIndex + 1) / exam.questions.length) * 100}%`
//               }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-6">
//         <div className="max-w-4xl mx-auto">
//           <Card className="question-card">
//             <div className="p-8">
//               {/* Question */}
//               <div className="mb-8">
//                 <div className="flex items-start justify-between mb-4">
//                   <h2 className="text-xl font-bold text-gray-800 pr-4">
//                     {currentQuestion.question_text}
//                   </h2>
//                   <div className="flex-shrink-0">
//                     <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
//                       Question {currentQuestionIndex + 1}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Options */}
//               <div className="space-y-4 mb-8">
//                 {['A', 'B', 'C', 'D'].map(option => (
//                   <label
//                     key={option}
//                     className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
//                       answers[currentQuestion.id] === option
//                         ? 'border-primary-500 bg-primary-50'
//                         : 'border-gray-200'
//                     } ${isExamEnded ? 'opacity-50 cursor-not-allowed' : ''}`}
//                   >
//                     <input
//                       type="radio"
//                       name={`question-${currentQuestion.id}`}
//                       value={option}
//                       checked={answers[currentQuestion.id] === option}
//                       onChange={() => handleAnswerChange(currentQuestion.id, option)}
//                       disabled={isExamEnded}
//                       className="mt-1 mr-4 h-4 w-4 text-primary-600"
//                     />
//                     <div className="flex-1">
//                       <span className="font-medium text-gray-800 mr-3">{option})</span>
//                       <span className="text-gray-700">
//                         {currentQuestion[`option_${option.toLowerCase()}`]}
//                       </span>
//                     </div>
//                     {answers[currentQuestion.id] === option && (
//                       <CheckCircle className="w-5 h-5 text-primary-600 ml-2 mt-0.5" />
//                     )}
//                   </label>
//                 ))}
//               </div>

//               {/* Navigation */}
//               <div className="flex justify-between items-center">
//                 <Button
//                   onClick={prevQuestion}
//                   disabled={currentQuestionIndex === 0 || isExamEnded}
//                   variant="secondary"
//                 >
//                   Previous
//                 </Button>

//                 {/* Question Numbers */}
//                 <div className="flex flex-wrap gap-2 max-w-md">
//                   {exam.questions.map((_, index) => (
//                     <button
//                       key={index}
//                       onClick={() => goToQuestion(index)}
//                       disabled={isExamEnded}
//                       className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
//                         index === currentQuestionIndex
//                           ? 'bg-primary-600 text-white'
//                           : answers[exam.questions[index].id]
//                           ? 'bg-green-500 text-white'
//                           : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
//                       } ${isExamEnded ? 'opacity-50 cursor-not-allowed' : ''}`}
//                     >
//                       {index + 1}
//                     </button>
//                   ))}
//                 </div>

//                 <div className="flex gap-2">
//                   {currentQuestionIndex === exam.questions.length - 1 ? (
//                     <Button
//                       onClick={() => handleSubmitExam(false)}
//                       loading={submitting}
//                       disabled={isExamEnded}
//                       variant="success"
//                     >
//                       Submit Exam
//                     </Button>
//                   ) : (
//                     <Button 
//                       onClick={nextQuestion}
//                       disabled={isExamEnded}
//                     >
//                       Next
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </Card>

//           {/* Submit Button (Always Visible) */}
//           {!isExamEnded && (
//             <div className="mt-6 text-center">
//               <Button
//                 onClick={() => handleSubmitExam(false)}
//                 loading={submitting}
//                 variant="danger"
//                 size="large"
//                 disabled={isExamEnded}
//               >
//                 Submit Exam Early
//               </Button>
//             </div>
//           )}

//           {/* Exam Status Messages */}
//           {isExamEnded && (
//             <div className="mt-6 text-center">
//               <Card>
//                 <div className="p-6">
//                   <div className="text-lg font-semibold text-gray-800 mb-2">
//                     {submitting ? 'Submitting Exam...' : 'Exam Completed'}
//                   </div>
//                   <div className="text-gray-600">
//                     {submitting ? 'Please wait while we process your submission.' : 'Your exam has been submitted successfully.'}
//                   </div>
//                   {submitting && (
//                     <div className="mt-4">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Recent Violations Display */}
//       {violations.length > 0 && (
//         <div className="fixed bottom-4 left-4 bg-red-100 border border-red-400 rounded-lg p-4 max-w-sm violation-alert max-h-48 overflow-y-auto">
//           <div className="text-red-800 font-bold mb-2 flex items-center">
//             <AlertTriangle className="w-4 h-4 mr-2" />
//             Recent Violations ({violations.length})
//           </div>
//           <div className="text-red-700 text-sm space-y-1">
//             {violations.slice(-3).map((v, i) => (
//               <div key={i} className="p-2 bg-red-50 rounded border-l-2 border-red-300">
//                 <div className="font-medium">{v.message}</div>
//                 <div className="text-xs text-red-600">
//                   {new Date(v.timestamp).toLocaleTimeString()}
//                 </div>
//               </div>
//             ))}
//             {violations.length > 3 && (
//               <div className="text-center text-red-600 text-xs pt-2">
//                 ... and {violations.length - 3} more violations
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Max Violations Warning Overlay */}
//       {totalViolations >= exam.max_violations && !isExamEnded && (
//         <div className="fixed inset-0 bg-red-900 bg-opacity-50 flex items-center justify-center z-50">
//           <Card className="p-6 max-w-md mx-4">
//             <div className="text-center">
//               <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//               <h3 className="text-lg font-bold text-red-800 mb-2">Maximum Violations Reached</h3>
//               <p className="text-red-700 mb-4">
//                 Your exam will be automatically submitted due to security violations.
//               </p>
//               <div className="animate-pulse text-red-600 font-medium">
//                 Auto-submitting...
//               </div>
//             </div>
//           </Card>
//         </div>
//       )}
//     </div>
//   )
// }

// export default ExamInterface

import React, { useState, useEffect, useRef ,useCallback} from 'react'
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import Button from '@components/common/Button'
import Card from '@components/common/Card'
import { formatTime } from '@utils/helpers'
import Alert from '../common/alert'
import { useExam } from '@hooks/useExam'
import AntiCheatMonitor from '@components/student/AntiCheatMonitor'

const ExamInterface = ({ exam, user, onExamComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(exam.duration_minutes * 60)
  const [violations, setViolations] = useState([])
  const [startTime] = useState(new Date().toISOString())
  const [isExamEnded, setIsExamEnded] = useState(false)
  const [lastViolationAlert, setLastViolationAlert] = useState(0)
  const [submissionInProgress, setSubmissionInProgress] = useState(false)
  
  const { submitExam, loading: submitting } = useExam()
  const currentQuestion = exam.questions[currentQuestionIndex]
  
  // Refs to prevent memory leaks and manage timers
  const timerRef = useRef(null)
  const violationTimeoutRef = useRef(null)
  const alertCooldownRef = useRef(false)
  const violationQueueRef = useRef([])
  const autoSubmitTriggeredRef = useRef(false)

  // Timer with proper cleanup
  useEffect(() => {
    if (isExamEnded || submitting || submissionInProgress) return

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1 && !autoSubmitTriggeredRef.current) {
          autoSubmitTriggeredRef.current = true
          setTimeout(() => handleSubmitExam(true, 'Time expired'), 100)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isExamEnded, submitting, submissionInProgress])

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (violationTimeoutRef.current) clearTimeout(violationTimeoutRef.current)
    }
  }, [])

  // Improved violation alert system with queue
  const showViolationAlert = (violationData) => {
    const now = Date.now()
    
    // More aggressive cooldown - only show alerts every 10 seconds
    if (now - lastViolationAlert < 10000 || alertCooldownRef.current) {
      // Queue the violation instead of showing immediately
      violationQueueRef.current.push(violationData)
      return
    }
    
    setLastViolationAlert(now)
    alertCooldownRef.current = true
    
    // Clear any existing timeout
    if (violationTimeoutRef.current) {
      clearTimeout(violationTimeoutRef.current)
    }
    
    // Process current violation and any queued ones
    const queuedViolations = violationQueueRef.current.length
    violationQueueRef.current = []
    
    // Show consolidated alert
    violationTimeoutRef.current = setTimeout(() => {
      let message = `Security Violation: ${violationData.message}`
      
      if (queuedViolations > 0) {
        message += `\n(+${queuedViolations} other violations detected)`
      }
      
      message += `\n\nTotal violations: ${violationData.totalViolations}/${exam.max_violations}`
      
      if (violationData.totalViolations >= exam.max_violations - 1) {
        message += '\n\n⚠️ WARNING: Next violation will auto-submit the exam!'
      }
      
    //   alert(message)
    <Alert type='warning' message={message}/>
      
      // Reset cooldown after alert is shown
      setTimeout(() => {
        alertCooldownRef.current = false
      }, 3000) // Longer cooldown after showing alert
    }, 500)
  }

  // const handleViolation = ({ type, message, totalViolations }) => {
  //   if (isExamEnded || submitting || submissionInProgress) return

  //   const violation = {
  //     type,
  //     message,
  //     timestamp: new Date().toISOString()
  //   }
    
  //   setViolations(prev => {
  //     const newViolations = [...prev, violation]
      
  //     // Show alert for this violation (with improved cooldown)
  //     showViolationAlert({
  //       type,
  //       message,
  //       totalViolations: newViolations.length
  //     })

  //     // Check if we've exceeded max violations
  //     if (newViolations.length >= exam.max_violations && !autoSubmitTriggeredRef.current) {
  //       autoSubmitTriggeredRef.current = true
        
  //       // Pause anti-cheat monitoring during auto-submit process
  //       if (window.pauseAntiCheat) {
  //         window.pauseAntiCheat(5000)
  //       }
        
  //       // Delay auto-submit to allow violation processing and prevent loops
  //       setTimeout(() => {
  //         if (!isExamEnded && !submitting && !submissionInProgress) {
  //           handleSubmitExam(true, 'Maximum violations exceeded')
  //         }
  //       }, 2000)
  //     }
      
  //     return newViolations
  //   })
  // }
   const handleSubmitExam = async (autoSubmit = false, reason = '') => {
  // Prevent multiple submissions with multiple checks
  if (submitting || isExamEnded || submissionInProgress) {
    console.log('Submission already in progress, skipping...')
    return
  }
  
  // Confirmation for manual submission (do this BEFORE stopping timer)
  if (!autoSubmit) {
    const unansweredCount = exam.questions.length - Object.keys(answers).length
    let confirmMessage = `Are you sure you want to submit the exam?\n\n`
    confirmMessage += `• Answered: ${Object.keys(answers).length}/${exam.questions.length} questions\n`
    confirmMessage += `• Time remaining: ${formatTime(timeLeft)}\n`
    
    if (unansweredCount > 0) {
      confirmMessage += `• ${unansweredCount} questions unanswered\n`
    }
    
    confirmMessage += `\nThis action cannot be undone.`
    
    if (!confirm(confirmMessage)) {
      // User cancelled - timer continues running, no state changes needed
      return
    }
  }
  
  // Set submission in progress ONLY after confirmation
  setSubmissionInProgress(true)
  setIsExamEnded(true)
  
  // Clear timer immediately ONLY after confirmation
  if (timerRef.current) {
    clearInterval(timerRef.current)
    timerRef.current = null
  }

  // Pause anti-cheat monitoring during submission
  if (window.pauseAntiCheat) {
    window.pauseAntiCheat(10000) // Pause for 10 seconds during submission
  }

  const submissionData = {
    answers,
    violations_count: violations.length,
    violations_log: violations,
    cheated: violations.length > 0,
    time_taken: Math.floor((exam.duration_minutes * 60 - timeLeft) / 60),
    started_at: startTime,
    submission_reason: autoSubmit ? (reason || 'Auto-submitted') : 'Manual submission'
  }

  try {
    console.log('Submitting exam with data:', submissionData)
    const result = await submitExam(exam.id, submissionData)
    
    // Exit fullscreen safely
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen()
      } catch (err) {
        console.log('Could not exit fullscreen:', err)
      }
    }
    
    const message = autoSubmit 
      ? `Exam auto-submitted: ${reason}\n\nScore: ${result.score}%\nViolations: ${result.violations_count}`
      : `Exam submitted successfully!\n\nScore: ${result.score}%\nViolations: ${result.violations_count}\nTime used: ${Math.floor((exam.duration_minutes * 60 - timeLeft) / 60)} minutes`
    
    alert(message)
      
      
    // Small delay before calling onExamComplete to ensure state is properly set
    setTimeout(() => {
      onExamComplete()
    }, 1000)
    
  } catch (error) {
    console.error('Submission error:', error)
    
    // More detailed error message
    let errorMessage = 'Failed to submit exam: '
    if (error.response?.data?.error) {
      errorMessage += error.response.data.error
    } else if (error.message) {
      errorMessage += error.message
    } else {
      errorMessage += 'Unknown error occurred'
    }
    
    alert(errorMessage)
    
    // Reset state on error to allow retry AND restart timer
    setIsExamEnded(false)
    setSubmissionInProgress(false)
    autoSubmitTriggeredRef.current = false
    
    // Restart the timer on error
    if (!timerRef.current && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1 && !autoSubmitTriggeredRef.current) {
            autoSubmitTriggeredRef.current = true
            setTimeout(() => handleSubmitExam(true, 'Time expired'), 100)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }
}
  const handleViolation = useCallback(({ type, message }) => {
  if (isExamEnded || submitting || submissionInProgress) return

  const violation = {
    type,
    message,
    timestamp: new Date().toISOString()
  }
  
  setViolations(prev => {
    const newViolations = [...prev, violation]
    
    // Use setTimeout to avoid state updates during render
    setTimeout(() => {
      // Show alert for this violation (with improved cooldown)
      showViolationAlert({
        type,
        message,
        totalViolations: newViolations.length
      })

      // Check if we've exceeded max violations
      if (newViolations.length >= exam.max_violations && !autoSubmitTriggeredRef.current) {
        autoSubmitTriggeredRef.current = true
        
        // Pause anti-cheat monitoring during auto-submit process
        if (window.pauseAntiCheat) {
          window.pauseAntiCheat(5000)
        }
        
        // Delay auto-submit to allow violation processing and prevent loops
        setTimeout(() => {
          if (!isExamEnded && !submitting && !submissionInProgress) {
            handleSubmitExam(true, 'Maximum violations exceeded')
          }
        }, 2000)
      }
    }, 0)
    
    return newViolations
  })
}, [isExamEnded, submitting, submissionInProgress, exam.max_violations, showViolationAlert, handleSubmitExam])

  const handleAnswerChange = (questionId, answer) => {
    if (isExamEnded || submitting || submissionInProgress) return
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < exam.questions.length - 1 && !isExamEnded) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestionIndex > 0 && !isExamEnded) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const goToQuestion = (index) => {
    if (!isExamEnded && index >= 0 && index < exam.questions.length) {
      setCurrentQuestionIndex(index)
    }
  }

  // const handleSubmitExam = async (autoSubmit = false, reason = '') => {
  //   // Prevent multiple submissions with multiple checks
  //   if (submitting || isExamEnded || submissionInProgress) {
  //     console.log('Submission already in progress, skipping...')
  //     return
  //   }
    
  //   // Set submission in progress immediately
  //   setSubmissionInProgress(true)
  //   setIsExamEnded(true)
    
  //   // Clear timer immediately
  //   if (timerRef.current) {
  //     clearInterval(timerRef.current)
  //     timerRef.current = null
  //   }

  //   // Pause anti-cheat monitoring during submission
  //   if (window.pauseAntiCheat) {
  //     window.pauseAntiCheat(10000) // Pause for 10 seconds during submission
  //   }

  //   // Confirmation for manual submission
  //   if (!autoSubmit) {
  //     const unansweredCount = exam.questions.length - Object.keys(answers).length
  //     let confirmMessage = `Are you sure you want to submit the exam?\n\n`
  //     confirmMessage += `• Answered: ${Object.keys(answers).length}/${exam.questions.length} questions\n`
  //     confirmMessage += `• Time remaining: ${formatTime(timeLeft)}\n`
      
  //     if (unansweredCount > 0) {
  //       confirmMessage += `• ${unansweredCount} questions unanswered\n`
  //     }
      
  //     confirmMessage += `\nThis action cannot be undone.`
      
  //     if (!confirm(confirmMessage)) {
  //       setIsExamEnded(false)
  //       setSubmissionInProgress(false)
  //       return
  //     }
  //   }

  //   const submissionData = {
  //     answers,
  //     violations_count: violations.length,
  //     violations_log: violations,
  //     cheated: violations.length > 0,
  //     time_taken: Math.floor((exam.duration_minutes * 60 - timeLeft) / 60),
  //     started_at: startTime,
  //     submission_reason: autoSubmit ? (reason || 'Auto-submitted') : 'Manual submission'
  //   }

  //   try {
  //     console.log('Submitting exam with data:', submissionData)
  //     const result = await submitExam(exam.id, submissionData)
      
  //     // Exit fullscreen safely
  //     if (document.fullscreenElement) {
  //       try {
  //         await document.exitFullscreen()
  //       } catch (err) {
  //         console.log('Could not exit fullscreen:', err)
  //       }
  //     }
      
  //     const message = autoSubmit 
  //       ? `Exam auto-submitted: ${reason}\n\nScore: ${result.score}%\nViolations: ${result.violations_count}`
  //       : `Exam submitted successfully!\n\nScore: ${result.score}%\nViolations: ${result.violations_count}\nTime used: ${Math.floor((exam.duration_minutes * 60 - timeLeft) / 60)} minutes`
      
  //     alert(message)
        
        
  //     // Small delay before calling onExamComplete to ensure state is properly set
  //     setTimeout(() => {
  //       onExamComplete()
  //     }, 1000)
      
  //   } catch (error) {
  //     console.error('Submission error:', error)
      
  //     // More detailed error message
  //     let errorMessage = 'Failed to submit exam: '
  //     if (error.response?.data?.error) {
  //       errorMessage += error.response.data.error
  //     } else if (error.message) {
  //       errorMessage += error.message
  //     } else {
  //       errorMessage += 'Unknown error occurred'
  //     }
      
  //   //   alert(errorMessage)
      
  //     <Alert type='warning' message={errorMessage}/>
      
  //     // Reset state on error to allow retry
  //     setIsExamEnded(false)
  //     setSubmissionInProgress(false)
  //     autoSubmitTriggeredRef.current = false
  //   }
  // }
 

  if (!exam || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <div className="text-gray-400 text-xl mb-4">Loading exam...</div>
        </div>
      </div>
    )
  }

  const totalViolations = violations.length
  const answeredQuestions = Object.keys(answers).length
  const progressPercentage = ((currentQuestionIndex + 1) / exam.questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-100 no-select">
      {/* Anti-Cheat Monitor */}
      <AntiCheatMonitor onViolation={handleViolation} isActive={!isExamEnded && !submissionInProgress} />

      {/* Exam Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{exam.title}</h1>
            <p className="text-gray-600">Student: {user.username} ({user.student_id})</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-sm text-gray-500">Time Remaining</div>
              <div className={`text-lg font-bold flex items-center ${
                timeLeft < 300 ? 'text-red-600' : timeLeft < 900 ? 'text-orange-600' : 'text-green-600'
              }`}>
                <Clock className="w-5 h-5 mr-2" />
                {formatTime(timeLeft)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Violations</div>
              <div className={`text-lg font-bold flex items-center ${
                totalViolations >= exam.max_violations ? 'text-red-600' : 
                totalViolations >= exam.max_violations - 1 ? 'text-orange-600' : 'text-gray-600'
              }`}>
                <AlertTriangle className="w-5 h-5 mr-2" />
                {totalViolations}/{exam.max_violations}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="px-6 py-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {exam.questions.length}
            </span>
            <span className="text-sm text-gray-600">
              Answered: {answeredQuestions}/{exam.questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="question-card">
            <div className="p-8">
              {/* Question */}
              <div className="mb-8">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800 pr-4">
                    {currentQuestion.question_text}
                  </h2>
                  <div className="flex-shrink-0">
                    <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                      Question {currentQuestionIndex + 1}
                    </span>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-4 mb-8">
                {['A', 'B', 'C', 'D'].map(option => (
                  <label
                    key={option}
                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                      answers[currentQuestion.id] === option
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200'
                    } ${isExamEnded || submissionInProgress ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={answers[currentQuestion.id] === option}
                      onChange={() => handleAnswerChange(currentQuestion.id, option)}
                      disabled={isExamEnded || submissionInProgress}
                      className="mt-1 mr-4 h-4 w-4 text-primary-600"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-800 mr-3">{option})</span>
                      <span className="text-gray-700">
                        {currentQuestion[`option_${option.toLowerCase()}`]}
                      </span>
                    </div>
                    {answers[currentQuestion.id] === option && (
                      <CheckCircle className="w-5 h-5 text-primary-600 ml-2 mt-0.5" />
                    )}
                  </label>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <Button
                  onClick={prevQuestion}
                  disabled={currentQuestionIndex === 0 || isExamEnded || submissionInProgress}
                  variant="secondary"
                >
                  Previous
                </Button>

                {/* Question Numbers */}
                <div className="flex flex-wrap gap-2 max-w-md">
                  {exam.questions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => goToQuestion(index)}
                      disabled={isExamEnded || submissionInProgress}
                      className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                        index === currentQuestionIndex
                          ? 'bg-primary-600 text-white'
                          : answers[question.id]
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      } ${isExamEnded || submissionInProgress ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title={`Question ${index + 1}${answers[question.id] ? ' (Answered)' : ' (Not answered)'}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  {currentQuestionIndex === exam.questions.length - 1 ? (
                    <Button
                      onClick={() => handleSubmitExam(false)}
                      loading={submitting || submissionInProgress}
                      disabled={isExamEnded}
                      variant="success"
                    >
                      Submit Exam
                    </Button>
                  ) : (
                    <Button 
                      variant='secondary'
                      onClick={nextQuestion}
                      disabled={isExamEnded || submissionInProgress}
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Submit Button (Always Visible) with better status */}
          {!isExamEnded && !submissionInProgress && (
            <div className="mt-6 text-center">
              <div className="mb-4 text-sm text-gray-600">
                Questions answered: {answeredQuestions}/{exam.questions.length}
                {answeredQuestions < exam.questions.length && (
                  <span className="text-orange-600 ml-2">
                    ({exam.questions.length - answeredQuestions} remaining)
                  </span>
                )}
              </div>
              <Button
                onClick={() => handleSubmitExam(false)}
                loading={submitting}
                variant="danger"
                size="large"
                disabled={isExamEnded || submissionInProgress}
              >
                Submit Exam Early
              </Button>
            </div>
          )}

          {/* Exam Status Messages */}
          {(isExamEnded || submissionInProgress) && (
            <div className="mt-6 text-center">
              <Card>
                <div className="p-6">
                  <div className="text-lg font-semibold text-gray-800 mb-2">
                    {submitting || submissionInProgress ? 'Submitting Exam...' : 'Exam Completed'}
                  </div>
                  <div className="text-gray-600 mb-4">
                    {submitting || submissionInProgress 
                      ? 'Please wait while we process your submission. Do not close this window.' 
                      : 'Your exam has been submitted successfully.'}
                  </div>
                  {(submitting || submissionInProgress) && (
                    <div className="mt-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                      <div className="text-sm text-gray-500 mt-2">
                        Processing your answers and calculating results...
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Recent Violations Display - Improved */}
      {violations.length > 0 && !isExamEnded && (
        <div className="fixed bottom-4 left-4 bg-red-100 border border-red-400 rounded-lg p-4 max-w-sm violation-alert max-h-48 overflow-y-auto">
          <div className="text-red-800 font-bold mb-2 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Security Violations ({violations.length})
          </div>
          <div className="text-red-700 text-sm space-y-1">
            {violations.slice(-3).map((v, i) => (
              <div key={`${v.timestamp}-${i}`} className="p-2 bg-red-50 rounded border-l-2 border-red-300">
                <div className="font-medium truncate">{v.message}</div>
                <div className="text-xs text-red-600">
                  {new Date(v.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
            {violations.length > 3 && (
              <div className="text-center text-red-600 text-xs pt-2 border-t border-red-200">
                ... and {violations.length - 3} more violations
              </div>
            )}
          </div>
          
          {/* Warning about upcoming auto-submit */}
          {totalViolations >= exam.max_violations - 1 && totalViolations < exam.max_violations && (
            <div className="mt-2 p-2 bg-orange-100 border border-orange-300 rounded">
              <div className="text-orange-800 text-xs font-bold">⚠️ FINAL WARNING</div>
              <div className="text-orange-700 text-xs">
                One more violation will auto-submit your exam!
              </div>
            </div>
          )}
        </div>
      )}

      {/* Max Violations Warning Overlay */}
      {totalViolations >= exam.max_violations && !isExamEnded && (
        <div className="fixed inset-0 bg-red-900 bg-opacity-75 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md mx-4">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-red-800 mb-2">Maximum Violations Reached</h3>
              <p className="text-red-700 mb-4">
                Your exam is being automatically submitted due to {totalViolations} security violations.
              </p>
              <div className="bg-red-100 border border-red-300 rounded p-3 mb-4">
                <div className="text-red-800 text-sm">
                  <strong>Violations detected:</strong>
                  <div className="mt-2 space-y-1">
                    {Object.entries(violations.reduce((acc, v) => {
                      acc[v.type] = (acc[v.type] || 0) + 1
                      return acc
                    }, {})).map(([type, count]) => (
                      <div key={type} className="flex justify-between">
                        <span className="capitalize">{type.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="font-bold">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center text-red-600 font-medium">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                Auto-submitting exam...
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Submission Overlay */}
      {(submitting || submissionInProgress) && !totalViolations >= exam.max_violations && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-40">
          <Card className="p-6 max-w-md mx-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Submitting Your Exam</h3>
              <p className="text-gray-600 mb-4">
                Please wait while we process your submission...
              </p>
              <div className="text-sm text-gray-500">
                Do not close this window or navigate away
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default ExamInterface