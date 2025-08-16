import React, { useState } from 'react'
import Button from '@components/common/Button'
import Input from '@components/common/Input'
import Alert from '@components/common/Alert'
import { validateEmail, validatePassword } from '@utils/helpers'

const CreateUserForm = ({ onCreateUser, onCancel }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'STUDENT'
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required'
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      const { confirmPassword, ...userData } = formData
      await onCreateUser(userData)
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to create user'
      if (typeof errorMsg === 'object') {
        setErrors(errorMsg)
      } else {
        setErrors({ submit: errorMsg })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={formData.first_name}
            onChange={(e) => handleInputChange('first_name', e.target.value)}
            error={errors.first_name}
            required
            placeholder="Enter first name"
          />

          <Input
            label="Last Name"
            value={formData.last_name}
            onChange={(e) => handleInputChange('last_name', e.target.value)}
            error={errors.last_name}
            required
            placeholder="Enter last name"
          />
        </div>

        <Input
          label="Username"
          value={formData.username}
          onChange={(e) => handleInputChange('username', e.target.value)}
          error={errors.username}
          required
          placeholder="Enter username"
        />

        <Input
          label="Email (Optional)"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          placeholder="Enter email address"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            error={errors.password}
            required
            placeholder="Enter password"
          />

          <Input
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            required
            placeholder="Confirm password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.role}
            onChange={(e) => handleInputChange('role', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="STUDENT">Student</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        {errors.submit && (
          <Alert type="error" message={errors.submit} />
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
            loading={loading}
          >
            Create User
          </Button>
        </div>
      </form>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">User Creation Info</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Students will receive auto-generated Student IDs</li>
          <li>• Admins can create exams and manage other users</li>
          <li>• Users will need to login with their username and password</li>
          <li>• Email is optional but recommended for communication</li>
        </ul>
      </div>
    </div>
  )
}

export default CreateUserForm