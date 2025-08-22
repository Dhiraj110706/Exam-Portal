import React, { useState, useEffect } from 'react'
import { Search, Download, Eye, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import Card from '@components/common/Card'
import Button from '@components/common/Button'
import Input from '@components/common/Input'
import Modal from '@components/common/Modal'
import { apiService } from '@services/apiService'

const ResultsPage = () => {
  const [results, setResults] = useState([])
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedExam, setSelectedExam] = useState('all')
  const [selectedResult, setSelectedResult] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadResults()
    loadExams()
  }, [])

  const loadResults = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('Loading results...')
      const data = await apiService.getResults()
      console.log('Results loaded:', data)
      setResults(data || [])
    } catch (error) {
      console.error('Failed to load results:', error)
      setError('Failed to load results. ' + (error.response?.data?.error || error.message))
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const loadExams = async () => {
    try {
      const data = await apiService.getExams()
      setExams(data || [])
    } catch (error) {
      console.error('Failed to load exams:', error)
    }
  }

  const filteredResults = results.filter(result => {
    if (!result || !result.student || !result.exam) return false
    
    const matchesSearch = (
      result.student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.student.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.student.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.student.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.exam.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    const matchesExam = selectedExam === 'all' || result.exam.id.toString() === selectedExam
    
    return matchesSearch && matchesExam
  })

  const handleViewDetails = (result) => {
    setSelectedResult(result)
    setShowDetails(true)
  }

  const exportResults = () => {
    if (filteredResults.length === 0) {
      alert('No results to export')
      return
    }

    // Convert results to CSV and download
    const csvContent = [
      ['Student ID', 'Student Name', 'Exam', 'Score', 'Time (min)', 'Violations', 'Cheated', 'Submitted'],
      ...filteredResults.map(result => [
        result.student.student_id || '',
        `${result.student.first_name || ''} ${result.student.last_name || ''}`.trim(),
        result.exam.title || '',
        result.score || 0,
        result.time_taken || 0,
        result.violations_count || 0,
        result.cheated ? 'Yes' : 'No',
        new Date(result.submitted_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'exam_results.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const calculateStats = () => {
    const totalSubmissions = filteredResults.length
    const averageScore = totalSubmissions > 0 
      ? (filteredResults.reduce((sum, r) => sum + (r.score || 0), 0) / totalSubmissions).toFixed(1)
      : 0
    const cheatingIncidents = filteredResults.filter(r => r.cheated).length
    const totalViolations = filteredResults.reduce((sum, r) => sum + (r.violations_count || 0), 0)

    return { totalSubmissions, averageScore, cheatingIncidents, totalViolations }
  }

  const stats = calculateStats()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
        </div>
        <Card className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Exam Results</h2>
          <p className="text-gray-600">View and analyze student exam performance</p>
        </div>
        <Button 
          onClick={exportResults}
          disabled={filteredResults.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Export Results
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <div className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
            <button 
              onClick={loadResults}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by student name, ID, or exam..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Exams</option>
              {exams.map(exam => (
                <option key={exam.id} value={exam.id.toString()}>
                  {exam.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {stats.totalSubmissions}
            </div>
            <div className="text-sm text-gray-600">Total Submissions</div>
          </div>
        </Card>
        <Card>
          <div className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {stats.averageScore}%
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
        </Card>
        <Card>
          <div className="p-6 text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">
              {stats.cheatingIncidents}
            </div>
            <div className="text-sm text-gray-600">Cheating Incidents</div>
          </div>
        </Card>
        <Card>
          <div className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {stats.totalViolations}
            </div>
            <div className="text-sm text-gray-600">Total Violations</div>
          </div>
        </Card>
      </div>

      {/* Results Table */}
      <Card>
        <div className="p-6">
          {filteredResults.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-2">No exam results found</div>
              <div className="text-sm text-gray-400">
                {results.length === 0 
                  ? "No students have taken any exams yet"
                  : "No results match your current filters"
                }
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-3 font-medium text-gray-700">Student</th>
                    <th className="pb-3 font-medium text-gray-700">Exam</th>
                    <th className="pb-3 font-medium text-gray-700">Score</th>
                    <th className="pb-3 font-medium text-gray-700">Time</th>
                    <th className="pb-3 font-medium text-gray-700">Status</th>
                    <th className="pb-3 font-medium text-gray-700">Violations</th>
                    <th className="pb-3 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((result) => (
                    <tr key={result.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {result.student.first_name} {result.student.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{result.student.username} • {result.student.student_id}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-gray-700">{result.exam.title}</td>
                      <td className="py-4">
                        <span className={`font-medium ${
                          result.score >= 90 ? 'text-green-600' :
                          result.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {result.score}%
                        </span>
                      </td>
                      <td className="py-4 text-gray-700">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {result.time_taken}m
                        </div>
                      </td>
                      <td className="py-4">
                        {result.cheated ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Flagged
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Clean
                          </span>
                        )}
                      </td>
                      <td className="py-4">
                        <span className={`font-medium ${
                          result.violations_count === 0 ? 'text-green-600' :
                          result.violations_count < 3 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {result.violations_count}
                        </span>
                      </td>
                      <td className="py-4">
                        <Button
                          size="small"
                          variant="outline"
                          onClick={() => handleViewDetails(result)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      {/* Result Details Modal */}
      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title="Exam Result Details"
        size="large"
      >
        {selectedResult && (
          <ResultDetails result={selectedResult} />
        )}
      </Modal>
    </div>
  )
}

// Result Details Component
const ResultDetails = ({ result }) => {
  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Student Information</h3>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Name:</span> {result.student.first_name} {result.student.last_name}</div>
            <div><span className="font-medium">Username:</span> @{result.student.username}</div>
            <div><span className="font-medium">Student ID:</span> {result.student.student_id}</div>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Exam Information</h3>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Exam:</span> {result.exam.title}</div>
            <div><span className="font-medium">Score:</span> <span className="font-bold text-lg">{result.score}%</span></div>
            <div><span className="font-medium">Time Taken:</span> {result.time_taken} minutes</div>
            <div><span className="font-medium">Submitted:</span> {new Date(result.submitted_at).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Violations */}
      {result.violations_log && result.violations_log.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Violations ({result.violations_count})</h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="space-y-2">
              {result.violations_log.map((violation, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-red-700">{violation.type}</span>
                  <span className="text-red-500 text-xs">
                    {new Date(violation.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
            {result.cheated && (
              <div className="mt-3 pt-3 border-t border-red-200">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Exam flagged due to excessive violations
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Answers Preview */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Answers Summary</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          {result.answers && Object.keys(result.answers).length > 0 ? (
            <div className="grid grid-cols-4 gap-4 text-sm">
              {Object.entries(result.answers).map(([questionId, answer]) => (
                <div key={questionId} className="text-center">
                  <div className="font-medium text-gray-700">Q{questionId}</div>
                  <div className="text-blue-600 font-bold">{answer}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-4">
              No answers recorded
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResultsPage