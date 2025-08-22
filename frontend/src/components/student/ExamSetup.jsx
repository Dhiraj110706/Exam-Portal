import React from 'react'
import { Shield, Camera, Monitor, AlertTriangle, Clock, BookOpen } from 'lucide-react'
import Button from '@components/common/Button'
import Card from '@components/common/Card'

const ExamSetup = ({ exam, user, onStartExam, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{exam.title}</h1>
          <p className="text-white/80">Student: {user.username} ({user.student_id})</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Security Notice */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />
                <h2 className="text-xl font-bold text-white">Security Requirements</h2>
              </div>
              <div className="space-y-3 text-white/90">
                <div className="flex items-start space-x-3">
                  <Monitor className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Fullscreen Mode Required</p>
                    <p className="text-sm text-white/70">Exam must be taken in fullscreen mode</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Camera className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Camera Monitoring</p>
                    <p className="text-sm text-white/70">Face detection will monitor your presence</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Anti-Cheat Detection</p>
                    <p className="text-sm text-white/70">Tab switching, copy-paste disabled</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Exam Details */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Exam Details</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center">
                    <BookOpen className="w-5 h-5 text-blue-400 mr-3" />
                    <span className="text-white">Questions</span>
                  </div>
                  <span className="text-white font-bold">{exam.questions.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-green-400 mr-3" />
                    <span className="text-white">Duration</span>
                  </div>
                  <span className="text-white font-bold">{exam.duration_minutes} minutes</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-orange-400 mr-3" />
                    <span className="text-white">Max Violations</span>
                  </div>
                  <span className="text-white font-bold">{exam.max_violations}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Rules */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mt-6">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">Exam Rules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/90">
              <div className="space-y-2">
                <p>• Stay in fullscreen mode throughout the exam</p>
                <p>• Keep your face visible to the camera</p>
                <p>• Do not switch tabs or open other applications</p>
                <p>• Do not copy, paste, or use right-click</p>
              </div>
              <div className="space-y-2">
                <p>• Answer all questions to the best of your ability</p>
                <p>• Submit before time expires</p>
                <p>• Maximum {exam.max_violations} violations allowed</p>
                <p>• Violations will result in automatic submission</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button
            variant="secondary"
            onClick={onBack}
            className="bg-white/20 text-white hover:bg-white/30 border-white/30"
          >
            Back to Dashboard
          </Button>
          <Button
            onClick={onStartExam}
            size="large"
            className="bg-green-600 text-white hover:bg-green-700 px-8 py-3 text-lg font-semibold"
          >
            I Understand - Start Exam
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ExamSetup
