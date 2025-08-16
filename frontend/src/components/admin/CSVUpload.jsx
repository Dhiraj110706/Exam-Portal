import React, { useState } from 'react'
import { Upload, FileText, AlertCircle } from 'lucide-react'
import Button from '@components/common/Button'
import Alert from '@components/common/Alert'

const CSVUpload = ({ onUpload }) => {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

  const handleFileSelect = (file) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please select a CSV file')
      return
    }
    
    setSelectedFile(file)
    setError('')
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setLoading(true)
    try {
      await onUpload(selectedFile)
      setSelectedFile(null)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
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
            {dragActive ? 'Drop your CSV file here' : 'Upload Questions CSV'}
          </p>
          <p className="text-sm text-gray-600">
            Drag and drop your CSV file here, or click to browse
          </p>
          <p className="text-xs text-gray-500">
            Supported format: CSV files only
          </p>
        </div>
      </div>

      {/* Selected File */}
      {selectedFile && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <Button
            onClick={handleUpload}
            loading={loading}
            size="small"
          >
            Upload
          </Button>
        </div>
      )}

      {/* Error */}
      {error && (
        <Alert type="error" message={error} />
      )}

      {/* CSV Format Guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-2">CSV Format Requirements</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Required columns:</strong> question, a, b, c, d, correct</p>
              <p><strong>Example row:</strong></p>
              <code className="block bg-blue-100 p-2 rounded text-xs mt-1">
                What is 2+2?,3,4,5,6,B
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CSVUpload