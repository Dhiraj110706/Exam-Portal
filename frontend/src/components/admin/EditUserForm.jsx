import React, { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Button from '@components/common/Button'
import Input from '@components/common/Input'
import { validateEmail, validatePassword, validateUsername } from '@utils/helpers'

const EditUserForm = ({ user, onUpdateUser, onCancel }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'STUDENT',
    password: '', // New password field (optional)
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [changePassword, setChangePassword] = useState(false)

  // Populate form with user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        role: user.role || 'STUDENT',
        password: '',
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate using your existing validation utilities
    const newErrors = {}
    
    // Required field validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (!validateUsername(formData.username.trim())) {
      newErrors.username = 'Username must be at least 3 characters and contain only letters, numbers, and underscores'
    }
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required'
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required'
    }
    
    // Email validation (optional but must be valid if provided)
    if (formData.email && formData.email.trim()) {
      if (!validateEmail(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address'
      }
    }
    
    // Password validation (only if user wants to change it)
    if (changePassword) {
      if (!formData.password.trim()) {
        newErrors.password = 'Password is required when changing password'
      } else if (!validatePassword(formData.password.trim())) {
        newErrors.password = 'Password must be at least 6 characters'
      }
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setLoading(true)
      try {
        // Prepare update data
        const updateData = {
          username: formData.username.trim(),
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          email: formData.email.trim() || null,
          role: formData.role,
        }

        // Add password only if user wants to change it
        if (changePassword && formData.password.trim()) {
          updateData.password = formData.password.trim()
        }

        await onUpdateUser(updateData)
      } catch (error) {
        // Error handling is done by parent component
      } finally {
        setLoading(false)
      }
    }
  }

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  return (
    <div className="space-y-6">
      {/* User Info Display */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Editing User</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p><span className="font-medium">Current Username:</span> {user?.username}</p>
          <p><span className="font-medium">Student ID:</span> {user?.student_id || 'N/A'}</p>
          <p><span className="font-medium">Created:</span> {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={formData.first_name}
            onChange={(e) => handleChange('first_name', e.target.value)}
            error={errors.first_name}
            placeholder="Enter first name"
            required
          />
          <Input
            label="Last Name"
            value={formData.last_name}
            onChange={(e) => handleChange('last_name', e.target.value)}
            error={errors.last_name}
            placeholder="Enter last name"
            required
          />
        </div>

        <Input
          label="Username"
          value={formData.username}
          onChange={(e) => handleChange('username', e.target.value)}
          error={errors.username}
          placeholder="Enter username"
          required
        />

        <Input
          label="Email (Optional)"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          placeholder="Enter email address"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="STUDENT">Student</option>
            <option value="ADMIN">Administrator</option>
          </select>
        </div>

        {/* Password Change Section */}
        <div className="border-t pt-4">
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="changePassword"
              checked={changePassword}
              onChange={(e) => {
                setChangePassword(e.target.checked)
                if (!e.target.checked) {
                  setFormData({ ...formData, password: '' })
                  if (errors.password) {
                    setErrors({ ...errors, password: '' })
                  }
                }
              }}
              className="rounded border-gray-300"
            />
            <label htmlFor="changePassword" className="text-sm font-medium text-gray-700">
              Change Password
            </label>
          </div>

          {changePassword && (
            <div className="relative">
              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                error={errors.password}
                placeholder="Enter new password"
                required={changePassword}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant ="success"
            loading={loading}
          >
            Update User
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditUserForm