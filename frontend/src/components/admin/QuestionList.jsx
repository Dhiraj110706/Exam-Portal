import React from 'react'
import { Check } from 'lucide-react'

const QuestionsList = ({ questions, selectedQuestions, onSelectQuestion, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4 p-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500">
        <p>No questions found. Upload a CSV file to get started.</p>
      </div>
    )
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {questions.map((question) => {
        const isSelected = selectedQuestions.find(q => q.id === question.id)
        
        return (
          <div
            key={question.id}
            onClick={() => onSelectQuestion(question)}
            className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
              isSelected ? 'bg-primary-50 border-primary-200' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium text-gray-800 mb-2 pr-4">
                  {question.question_text}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">A)</span>
                    {question.option_a}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">B)</span>
                    {question.option_b}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">C)</span>
                    {question.option_c}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">D)</span>
                    {question.option_d}
                  </div>
                </div>
                <div className="mt-2 text-xs text-green-600">
                  <strong>Correct Answer: {question.correct_answer}</strong>
                </div>
              </div>
              
              {isSelected && (
                <div className="flex-shrink-0 ml-4">
                  <div className="bg-primary-600 text-white rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default QuestionsList