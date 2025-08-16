import React, { useState, useEffect } from 'react'
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import Button from '@components/common/Button'
import Card from '@components/common/Card'
import { formatTime } from '@utils/helpers'
import { useExam } from '@hooks/useExam'
import AntiCheatMonitor from '@components/student/AntiCheatMonitor'

const ExamInterface = ({ exam, user, onExamComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(exam.duration_minutes * 60)
  const [violations, setViolations] = useState([])
  const [startTime] = useState(new Date().toISOString())
  
  const { submitExam, loading: submitting } = useExam()
  const currentQuestion = exam.questions[currentQuestionIndex]

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmitExam(true) // Auto submit on timeout
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleViolation = ({ type, message, totalViolations }) => {
    const violation = {
      type,
      message,
      timestamp: new Date().toISOString()
    }
    
    const newViolations = [...violations, violation]
    setViolations(newViolations)

    // Show violation alert
    alert(`Security Violation: ${message}\nTotal violations: ${totalViolations}/${exam.max_violations}`)

    if (totalViolations >= exam.max_violations) {
      handleSubmitExam(true) // Auto submit on max violations
    }
  }

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index)
  }

  const handleSubmitExam = async (autoSubmit = false) => {
    if (submitting) return
    
    if (!autoSubmit && !confirm('Are you sure you want to submit the exam?')) {
      return
    }

    const submissionData = {
      answers,
      violations_count: violations.length,
      violations_log: violations,
      cheated: violations.length > 0,
      time_taken: Math.floor((exam.duration_minutes * 60 - timeLeft) / 60),
      started_at: startTime
    }

    try {
      const result = await submitExam(exam.id, submissionData)
      
      // Exit fullscreen
      if (document.fullscreenElement) {
        document.exitFullscreen()
      }
      
      alert(`Exam submitted successfully!\nScore: ${result.score}%\nViolations: ${result.violations_count}`)
      onExamComplete()
    } catch (error) {
      alert('Failed to submit exam: ' + (error.response?.data?.error || error.message))
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 no-select">
      {/* Anti-Cheat Monitor */}
      <AntiCheatMonitor onViolation={handleViolation} isActive={true} />

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
                timeLeft < 300 ? 'text-red-600' : 'text-green-600'
              }`}>
                <Clock className="w-5 h-5 mr-2" />
                {formatTime(timeLeft)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Violations</div>
              <div className={`text-lg font-bold flex items-center ${
                violations.length >= exam.max_violations ? 'text-red-600' : 'text-orange-600'
              }`}>
                <AlertTriangle className="w-5 h-5 mr-2" />
                {violations.length}/{exam.max_violations}
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
              Answered: {Object.keys(answers).length}/{exam.questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / exam.questions.length) * 100}%`
              }}
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
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={answers[currentQuestion.id] === option}
                      onChange={() => handleAnswerChange(currentQuestion.id, option)}
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
                  disabled={currentQuestionIndex === 0}
                  variant="secondary"
                >
                  Previous
                </Button>

                {/* Question Numbers */}
                <div className="flex flex-wrap gap-2 max-w-md">
                  {exam.questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToQuestion(index)}
                      className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                        index === currentQuestionIndex
                          ? 'bg-primary-600 text-white'
                          : answers[exam.questions[index].id]
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  {currentQuestionIndex === exam.questions.length - 1 ? (
                    <Button
                      onClick={() => handleSubmitExam(false)}
                      loading={submitting}
                      variant="success"
                    >
                      Submit Exam
                    </Button>
                  ) : (
                    <Button onClick={nextQuestion}>
                      Next
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Submit Button (Always Visible) */}
          <div className="mt-6 text-center">
            <Button
              onClick={() => handleSubmitExam(false)}
              loading={submitting}
              variant="danger"
              size="large"
            >
              Submit Exam Early
            </Button>
          </div>
        </div>
      </div>

      {/* Violation Alerts */}
      {violations.length > 0 && (
        <div className="fixed bottom-4 left-4 bg-red-100 border border-red-400 rounded-lg p-4 max-w-sm violation-alert">
          <div className="text-red-800 font-bold">Recent Violations:</div>
          <div className="text-red-700 text-sm mt-1">
            {violations.slice(-3).map((v, i) => (
              <div key={i}>{v.message}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ExamInterface