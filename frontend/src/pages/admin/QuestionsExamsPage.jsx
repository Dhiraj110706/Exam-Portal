import React, { useState } from 'react'
import { Upload, Plus, Search } from 'lucide-react'
import Card from '@components/common/Card'
import Button from '@components/common/Button'
import Input from '@components/common/Input'
import Modal from '@components/common/Modal'
import Alert from '@components/common/Alert'
import { useQuestions } from '@hooks/useQuestions'
import { useExam } from '@hooks/useExam'
import CSVUpload from '@components/admin/CSVUpload'
import QuestionsList from '@components/admin/QuestionsList'
import ExamCreator from '@components/admin/ExamCreator'
import ExamsList from '@components/admin/ExamsList'

const QuestionsExamsPage = () => {
  const [activeTab, setActiveTab] = useState('questions')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedQuestions, setSelectedQuestions] = useState([])
  const [showCreateExam, setShowCreateExam] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const { questions, loading: questionsLoading, uploadCSV } = useQuestions()
  const { createExam, loading: examLoading } = useExam()

  const filteredQuestions = questions.filter(q => 
    q.question_text.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCSVUpload = async (file) => {
    try {
      const result = await uploadCSV(file)
      setShowUpload(false)
      setSuccessMessage(result.message)
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error) {
      // Error is handled by the hook
    }
  }

  const handleCreateExam = async (examData) => {
    try {
      const result = await createExam(examData, selectedQuestions)
      setSelectedQuestions([])
      setShowCreateExam(false)
      setSuccessMessage(result.message)
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error) {
      // Error is handled by the hook
    }
  }

  const handleSelectQuestion = (question) => {
    const isSelected = selectedQuestions.find(q => q.id === question.id)
    if (isSelected) {
      setSelectedQuestions(selectedQuestions.filter(q => q.id !== question.id))
    } else {
      setSelectedQuestions([...selectedQuestions, question])
    }
  }

  const tabs = [
    { id: 'questions', name: 'Questions Bank', count: questions.length },
    { id: 'exams', name: 'Exams', count: 0 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Questions & Exams</h2>
          <p className="text-gray-600">Manage your question bank and create exams</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => setShowUpload(true)}
            variant="outline"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload CSV
          </Button>
          {selectedQuestions.length > 0 && (
            <Button
              onClick={() => setShowCreateExam(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Exam ({selectedQuestions.length})
            </Button>
          )}
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert type="success" message={successMessage} />
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'questions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Questions List */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Questions Bank</h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {filteredQuestions.length} questions
                  </span>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <QuestionsList
                questions={filteredQuestions}
                selectedQuestions={selectedQuestions}
                onSelectQuestion={handleSelectQuestion}
                loading={questionsLoading}
              />
            </Card>
          </div>

          {/* Selected Questions */}
          <div>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Selected Questions ({selectedQuestions.length})
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {selectedQuestions.map((question, index) => (
                    <div key={question.id} className="bg-gray-50 p-3 rounded border">
                      <div className="text-sm font-medium mb-1">
                        {index + 1}. {question.question_text.substring(0, 50)}...
                      </div>
                      <button
                        onClick={() => handleSelectQuestion(question)}
                        className="text-red-600 text-xs hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {selectedQuestions.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-8">
                      Click on questions to add them to your exam
                    </p>
                  )}
                </div>
                {selectedQuestions.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <Button
                      onClick={() => setShowCreateExam(true)}
                      className="w-full"
                    >
                      Create Exam with {selectedQuestions.length} Questions
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'exams' && (
        <div>
          <ExamsList />
        </div>
      )}

      {/* CSV Upload Modal */}
      <Modal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        title="Upload Questions CSV"
        size="medium"
      >
        <CSVUpload onUpload={handleCSVUpload} />
      </Modal>

      {/* Create Exam Modal */}
      <Modal
        isOpen={showCreateExam}
        onClose={() => setShowCreateExam(false)}
        title="Create New Exam"
        size="large"
      >
        <ExamCreator
          selectedQuestions={selectedQuestions}
          onCreateExam={handleCreateExam}
          loading={examLoading}
          onCancel={() => setShowCreateExam(false)}
        />
      </Modal>
    </div>
  )
}

export default QuestionsExamsPage