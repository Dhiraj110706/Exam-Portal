import React, { useState } from 'react'
import { Upload, Users, Download, AlertCircle } from 'lucide-react'
import Button from '@components/common/Button'
import Alert from '@components/common/Alert'
import Card from '@components/common/Card'
import { apiService } from '@services/apiService'

const BulkStudentImport = ({ onImportComplete, onCancel }) => {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [previewData, setPreviewData] = useState([])
  const [showPreview, setShowPreview] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = async (file) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please select a CSV file')
      return
    }
    
    setSelectedFile(file)
    setError('')
    
    // Preview CSV data
    try {
      const text = await file.text()
      const lines = text.split('\n')
      const headers = lines[0].split(',').map(h => h.trim())
      
      // Validate headers
      const requiredHeaders = ['first_name', 'last_name', 'username', 'email', 'password']
      const missingHeaders = requiredHeaders.filter(header => !headers.includes(header))
      
      if (missingHeaders.length > 0) {
        setError(`Missing required columns: ${missingHeaders.join(', ')}`)
        return
      }
      
      // Parse preview data (first 5 rows)
      const preview = []
      for (let i = 1; i < Math.min(6, lines.length); i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.trim())
          const row = {}
          headers.forEach((header, index) => {
            row[header] = values[index] || ''
          })
          preview.push(row)
        }
      }
      
      setPreviewData(preview)
      setShowPreview(true)
    } catch (error) {
      setError('Failed to parse CSV file')
    }
  }

  const handleBulkImport = async () => {
    if (!selectedFile) return

    setLoading(true)
    try {
      const result = await apiService.bulkImportStudents(selectedFile)
      setSelectedFile(null)
      setShowPreview(false)
      onImportComplete(result.message, result.imported_count)
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to import students')
    } finally {
      setLoading(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = "first_name,last_name,username,email,password\nJohn,Doe,john_doe,john@example.com,password123\nJane,Smith,jane_smith,jane@example.com,password123"
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'student_import_template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Template Download */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <Download className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-900">Download Template</h4>
              <p className="text-sm text-blue-800 mt-1">
                Download the CSV template with the correct format for bulk student import.
              </p>
              <Button
                onClick={downloadTemplate}
                size="small"
                variant="outline"
                className="mt-2 border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          onChange={(e) => handleFileSelect(e.target.files[0])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">
            {dragActive ? 'Drop your CSV file here' : 'Upload Students CSV'}
          </p>
          <p className="text-sm text-gray-600">
            Drag and drop your CSV file here, or click to browse
          </p>
        </div>
      </div>

      {/* CSV Format Guide */}
      <Card className="bg-gray-50 border-gray-200">
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-gray-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">CSV Format Requirements</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Required columns:</strong> first_name, last_name, username, email, password</p>
                <p><strong>Example row:</strong></p>
                <code className="block bg-gray-100 p-2 rounded text-xs mt-1">
                  John,Doe,john_doe,john@example.com,password123
                </code>
                <div className="mt-2">
                  <p><strong>Notes:</strong></p>
                  <ul className="text-xs text-gray-600 mt-1 space-y-1">
                    <li>• Student IDs will be auto-generated</li>
                    <li>• Usernames must be unique</li>
                    <li>• Email is optional but recommended</li>
                    <li>• All students will have "STUDENT" role</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Preview */}
      {showPreview && previewData.length > 0 && (
        <Card>
          <div className="p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Preview ({previewData.length} students shown)
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">First Name</th>
                    <th className="text-left py-2">Last Name</th>
                    <th className="text-left py-2">Username</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">Password</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2">{row.first_name}</td>
                      <td className="py-2">{row.last_name}</td>
                      <td className="py-2">{row.username}</td>
                      <td className="py-2">{row.email || '-'}</td>
                      <td className="py-2">{'*'.repeat(row.password?.length || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Alert type="error" message={error} />
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
          variant="success"
          onClick={handleBulkImport}
          loading={loading}
          disabled={!selectedFile || !showPreview}
        >
          <Users className="w-4 h-4 mr-2" />
          Import Students
        </Button>
      </div>
    </div>
  )
}

export default BulkStudentImport