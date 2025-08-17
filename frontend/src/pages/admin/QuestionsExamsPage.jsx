// import React, { useState } from 'react'
// import { Upload, Plus, Search } from 'lucide-react'
// import Card from '@components/common/Card'
// import Button from '@components/common/Button'
// import Input from '@components/common/Input'
// import Modal from '@components/common/Modal'
// import Alert from '@components/common/Alert'
// import { useQuestions } from '@hooks/useQuestions'
// import { useExam } from '@hooks/useExam'
// import CSVUpload from '@components/admin/CSVUpload'
// import QuestionsList from '@components/admin/QuestionsList'
// import ExamCreator from '@components/admin/ExamCreator'
// import ExamsList from '@components/admin/ExamsList'

// const QuestionsExamsPage = () => {
//   const [activeTab, setActiveTab] = useState('questions')
//   const [searchTerm, setSearchTerm] = useState('')
//   const [selectedQuestions, setSelectedQuestions] = useState([])
//   const [showCreateExam, setShowCreateExam] = useState(false)
//   const [showUpload, setShowUpload] = useState(false)
//   const [successMessage, setSuccessMessage] = useState('')
//   const [errorMessage, setErrorMessage] = useState('')

//   const { questions, loading: questionsLoading, uploadCSV } = useQuestions()
//   const { createExam, loading: examLoading, error: examError } = useExam()

//   const filteredQuestions = questions.filter(q => 
//     q.question_text.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   const handleCSVUpload = async (file) => {
//     try {
//       const result = await uploadCSV(file)
//       setShowUpload(false)
//       setSuccessMessage(result.message)
//       setTimeout(() => setSuccessMessage(''), 5000)
//     } catch (error) {
//       setErrorMessage('Failed to upload CSV file')
//       setTimeout(() => setErrorMessage(''), 5000)
//     }
//   }

//   const handleCreateExam = async (examData) => {
//     try {
//       console.log('Creating exam with data:', examData) // Debug log
//       const result = await createExam(examData)
//       setSelectedQuestions([])
//       setShowCreateExam(false)
//       setSuccessMessage(result.message)
//       setTimeout(() => setSuccessMessage(''), 5000)
//     } catch (error) {
//       console.error('Error in handleCreateExam:', error) // Debug log
//       const errorMsg = error.response?.data?.error || 'Failed to create exam'
//       setErrorMessage(errorMsg)
//       setTimeout(() => setErrorMessage(''), 5000)
//     }
//   }

//   const handleSelectQuestion = (question) => {
//     const isSelected = selectedQuestions.find(q => q.id === question.id)
//     if (isSelected) {
//       setSelectedQuestions(selectedQuestions.filter(q => q.id !== question.id))
//     } else {
//       setSelectedQuestions([...selectedQuestions, question])
//     }
//   }

//   const tabs = [
//     { id: 'questions', name: 'Questions Bank', count: questions.length },
//     { id: 'exams', name: 'Exams', count: 0 }
//   ]

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Questions & Exams</h2>
//           <p className="text-gray-600">Manage your question bank and create exams</p>
//         </div>
//         <div className="flex space-x-3">
//           <Button
//             onClick={() => setShowUpload(true)}
//             variant="outline"
//           >
//             <Upload className="w-4 h-4 mr-2" />
//             Upload CSV
//           </Button>
//           {selectedQuestions.length > 0 && (
//             <Button
//               onClick={() => setShowCreateExam(true)}
//             >
//               <Plus className="w-4 h-4 mr-2" />
//               Create Exam ({selectedQuestions.length})
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* Success Message */}
//       {successMessage && (
//         <Alert type="success" message={successMessage} />
//       )}

//       {/* Error Message */}
//       {errorMessage && (
//         <Alert type="error" message={errorMessage} />
//       )}

//       {/* Tabs */}
//       <div className="border-b border-gray-200">
//         <nav className="-mb-px flex space-x-8">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`py-2 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === tab.id
//                   ? 'border-primary-500 text-primary-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               {tab.name} ({tab.count})
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* Content */}
//       {activeTab === 'questions' && (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Questions List */}
//           <div className="lg:col-span-2">
//             <Card>
//               <div className="p-6 border-b border-gray-200">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-semibold">Questions Bank</h3>
//                   <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
//                     {filteredQuestions.length} questions
//                   </span>
//                 </div>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                   <Input
//                     type="text"
//                     placeholder="Search questions..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-10"
//                   />
//                 </div>
//               </div>
//               <QuestionsList
//                 questions={filteredQuestions}
//                 selectedQuestions={selectedQuestions}
//                 onSelectQuestion={handleSelectQuestion}
//                 loading={questionsLoading}
//               />
//             </Card>
//           </div>

//           {/* Selected Questions */}
//           <div>
//             <Card>
//               <div className="p-6">
//                 <h3 className="text-lg font-semibold mb-4">
//                   Selected Questions ({selectedQuestions.length})
//                 </h3>
//                 <div className="space-y-2 max-h-96 overflow-y-auto">
//                   {selectedQuestions.map((question, index) => (
//                     <div key={question.id} className="bg-gray-50 p-3 rounded border">
//                       <div className="text-sm font-medium mb-1">
//                         {index + 1}. {question.question_text.substring(0, 50)}...
//                       </div>
//                       <button
//                         onClick={() => handleSelectQuestion(question)}
//                         className="text-red-600 text-xs hover:text-red-800"
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   ))}
//                   {selectedQuestions.length === 0 && (
//                     <p className="text-gray-500 text-sm text-center py-8">
//                       Click on questions to add them to your exam
//                     </p>
//                   )}
//                 </div>
//                 {selectedQuestions.length > 0 && (
//                   <div className="mt-4 pt-4 border-t">
//                     <Button
//                       onClick={() => setShowCreateExam(true)}
//                       className="w-full"
//                     >
//                       Create Exam with {selectedQuestions.length} Questions
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </Card>
//           </div>
//         </div>
//       )}

//       {activeTab === 'exams' && (
//         <div>
//           <ExamsList />
//         </div>
//       )}

//       {/* CSV Upload Modal */}
//       <Modal
//         isOpen={showUpload}
//         onClose={() => setShowUpload(false)}
//         title="Upload Questions CSV"
//         size="medium"
//       >
//         <CSVUpload onUpload={handleCSVUpload} />
//       </Modal>

//       {/* Create Exam Modal */}
//       <Modal
//         isOpen={showCreateExam}
//         onClose={() => setShowCreateExam(false)}
//         title="Create New Exam"
//         size="large"
//       >
//         <ExamCreator
//           selectedQuestions={selectedQuestions}
//           onCreateExam={handleCreateExam}
//           loading={examLoading}
//           onCancel={() => setShowCreateExam(false)}
//         />
//       </Modal>
//     </div>
//   )
// }

// export default QuestionsExamsPage
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
  const [errorMessage, setErrorMessage] = useState('')

  const { questions, loading: questionsLoading, uploadCSV, error: questionsError } = useQuestions()
  const { createExam, loading: examLoading, error: examError } = useExam()

  const filteredQuestions = questions.filter(q => 
    q.question_text.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCSVUpload = async (file) => {
    try {
      const result = await uploadCSV(file)
      setShowUpload(false)
      setSuccessMessage(result.message)
      setErrorMessage('')
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error) {
      console.error('CSV upload error:', error)
      setErrorMessage(questionsError || 'Failed to upload CSV file')
      setTimeout(() => setErrorMessage(''), 5000)
    }
  }

  const handleCreateExam = async (examData) => {
    try {
      console.log('handleCreateExam: Received exam data:', examData)
      console.log('handleCreateExam: Selected questions:', selectedQuestions)
      
      // Ensure we have the question_ids in the examData
      if (!examData.question_ids && selectedQuestions.length > 0) {
        examData.question_ids = selectedQuestions.map(q => q.id)
      }
      
      console.log('handleCreateExam: Final exam data:', examData)
      
      const result = await createExam(examData)
      
      // Success - clear state and show message
      setSelectedQuestions([])
      setShowCreateExam(false)
      setSuccessMessage(result.message)
      setErrorMessage('')
      setTimeout(() => setSuccessMessage(''), 5000)
      
      console.log('handleCreateExam: Success:', result)
    } catch (error) {
      console.error('handleCreateExam: Error:', error)
      const errorMsg = examError || error.message || 'Failed to create exam'
      setErrorMessage(errorMsg)
      setTimeout(() => setErrorMessage(''), 5000)
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

  const clearSelectedQuestions = () => {
    setSelectedQuestions([])
  }

  const tabs = [
    { id: 'questions', name: 'Questions Bank', count: questions.length },
    { id: 'exams', name: 'Exams', count: createExam.length }
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
            variant='success'
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

      {/* Error Message */}
      {errorMessage && (
        <Alert type="error" message={errorMessage} />
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Selected Questions ({selectedQuestions.length})
                  </h3>
                  {selectedQuestions.length > 0 && (
                    <Button
                      size="small"
                      variant="outline"
                      onClick={clearSelectedQuestions}
                    >
                      Clear All
                    </Button>
                  )}
                </div>
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
                    <Button variant="success"
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
        onClose={() => {
          setShowCreateExam(false)
          setErrorMessage('')
        }}
        title="Create New Exam"
        size="large"
      >
        <ExamCreator
          selectedQuestions={selectedQuestions}
          onCreateExam={handleCreateExam}
          loading={examLoading}
          onCancel={() => {
            setShowCreateExam(false)
            setErrorMessage('')
          }}
        />
      </Modal>
    </div>
  )
}

export default QuestionsExamsPage