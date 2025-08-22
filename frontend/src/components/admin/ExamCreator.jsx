import React, { useState } from 'react'
import Button from '@components/common/Button'
import Input from '@components/common/Input'
import Alert from '@components/common/Alert'

const ExamCreator = ({ selectedQuestions, onCreateExam, loading, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration_minutes: 60,
    max_violations: 3,
    is_active: true
  })
  const [errors, setErrors] = useState({})

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (formData.duration_minutes < 1) {
      newErrors.duration_minutes = 'Duration must be at least 1 minute'
    }
    
    if (formData.max_violations < 1 || formData.max_violations > 10) {
      newErrors.max_violations = 'Max violations must be between 1 and 10'
    }

    if (!selectedQuestions || selectedQuestions.length === 0) {
      newErrors.questions = 'Please select at least one question'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      console.log('ExamCreator: Submitting form with data:', formData)
      console.log('ExamCreator: Selected questions:', selectedQuestions)
      
      // Create exam data with question IDs
      const examData = {
        ...formData,
        question_ids: selectedQuestions.map(q => q.id)
      }
      
      console.log('ExamCreator: Final exam data:', examData)
      
      await onCreateExam(examData)
    } catch (error) {
      console.error('ExamCreator: Error in handleSubmit:', error)
      // Error will be handled by parent component
    }
  }

  return (
    <div className="space-y-6">
      {/* Selected Questions Preview */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900">
            Selected Questions ({selectedQuestions?.length || 0})
          </h4>
        </div>
        {selectedQuestions && selectedQuestions.length > 0 ? (
          <div className="max-h-32 overflow-y-auto space-y-2">
            {selectedQuestions.map((question, index) => (
              <div key={question.id} className="text-sm text-gray-600">
                {index + 1}. {question.question_text.substring(0, 80)}...
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 py-2">
            No questions selected
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Exam Title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          error={errors.title}
          required
          placeholder="Enter exam title"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter exam description (optional)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Duration (minutes)"
            type="number"
            value={formData.duration_minutes}
            onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value) || 60)}
            error={errors.duration_minutes}
            required
            min="1"
            placeholder="Enter duration in minutes"
          />

          <Input
            label="Max Violations"
            type="number"
            value={formData.max_violations}
            onChange={(e) => handleInputChange('max_violations', parseInt(e.target.value) || 3)}
            error={errors.max_violations}
            required
            min="1"
            max="10"
            placeholder="Enter max violations allowed"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => handleInputChange('is_active', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
            Make exam active immediately
          </label>
        </div>

        {errors.questions && (
          <Alert type="error" message={errors.questions} />
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="success"
            loading={loading}
          >
            Create Exam
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ExamCreator