import React, { useState, useEffect } from 'react'
import { Search, Download, Eye, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import  Card  from '@components/common/Card'
import  Button  from '@components/common/Button'
import  Input  from '@components/common/Input'
import  Modal  from '@components/common/Modal'
import { apiService } from '@services/apiService'

const ResultsPage = () => {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedExam, setSelectedExam] = useState('all')
  const [selectedResult, setSelectedResult] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    try {
      // This would be a real API call
    //   const data = await apiService.getResults()
      
      // Mock data for demonstration
      const mockResults = [
        {
          id: 1,
          student: { username: 'john_doe', first_name: 'John', last_name: 'Doe', student_id: 'STU001' },
          exam: { title: 'Mathematics Quiz', id: 1 },
          score: 85.5,
          time_taken: 45,
          cheated: false,
          violations_count: 0,
          submitted_at: '2024-08-16T10:30:00Z',
          answers: { '1': 'A', '2': 'B', '3': 'C' },
          violations_log: []
        },
        {
          id: 2,
          student: { username: 'jane_smith', first_name: 'Jane', last_name: 'Smith', student_id: 'STU002' },
          exam: { title: 'Science Test', id: 2 },
          score: 92.0,
          time_taken: 38,
          cheated: false,
          violations_count: 2,
          submitted_at: '2024-08-16T09:15:00Z',
          answers: { '1': 'B', '2': 'A', '3': 'D' },
          violations_log: [
            { type: 'Tab switched', timestamp: '2024-08-16T09:10:00Z' },
            { type: 'Face not detected', timestamp: '2024-08-16T09:12:00Z' }
          ]
        },
        {
          id: 3,
          student: { username: 'bob_wilson', first_name: 'Bob', last_name: 'Wilson', student_id: 'STU003' },
          exam: { title: 'History Exam', id: 3 },
          score: 67.5,
          time_taken: 60,
          cheated: true,
          violations_count: 5,
          submitted_at: '2024-08-16T11:45:00Z',
          answers: { '1': 'C', '2': 'D', '3': 'A' },
          violations_log: [
            { type: 'Right-click attempted', timestamp: '2024-08-16T11:20:00Z' },
            { type: 'Tab switched', timestamp: '2024-08-16T11:25:00Z' },
            { type: 'Face not detected', timestamp: '2024-08-16T11:30:00Z' },
            { type: 'Developer tools attempted', timestamp: '2024-08-16T11:35:00Z' },
            { type: 'Tab switched', timestamp: '2024-08-16T11:40:00Z' }
          ]
        }
      ]
      
      setResults(mockResults)
    } catch (error) {
      console.error('Failed to load results:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredResults = results.filter(result => {
    const matchesSearch = result.student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.exam.title.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesExam = selectedExam === 'all' || result.exam.id.toString() === selectedExam
    
    return matchesSearch && matchesExam
  })

  const handleViewDetails = (result) => {
    setSelectedResult(result)
    setShowDetails(true)
  }

  const exportResults = () => {
    // Convert results to CSV and download
    const csvContent = [
      ['Student ID', 'Student Name', 'Exam', 'Score', 'Time (min)', 'Violations', 'Cheated', 'Submitted'],
      ...filteredResults.map(result => [
        result.student.student_id,
        `${result.student.first_name} ${result.student.last_name}`,
        result.exam.title,
        result.score,
        result.time_taken,
        result.violations_count,
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

  if (loading) {
    return (
      <div className="space-y-6">
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
        <Button onClick={exportResults}>
          <Download className="w-4 h-4 mr-2" />
          Export Results
        </Button>
      </div>

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
              <option value="1">Mathematics Quiz</option>
              <option value="2">Science Test</option>
              <option value="3">History Exam</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {filteredResults.length}
            </div>
            <div className="text-sm text-gray-600">Total Submissions</div>
          </div>
        </Card>
        <Card>
          <div className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {filteredResults.reduce((sum, r) => sum + r.score, 0) / filteredResults.length || 0}%
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
        </Card>
        <Card>
          <div className="p-6 text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">
              {filteredResults.filter(r => r.cheated).length}
            </div>
            <div className="text-sm text-gray-600">Cheating Incidents</div>
          </div>
        </Card>
        <Card>
          <div className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {filteredResults.reduce((sum, r) => sum + r.violations_count, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Violations</div>
          </div>
        </Card>
      </div>

      {/* Results Table */}
      <Card>
        <div className="p-6">
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
      {result.violations_log.length > 0 && (
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
          <div className="grid grid-cols-4 gap-4 text-sm">
            {Object.entries(result.answers).map(([questionId, answer]) => (
              <div key={questionId} className="text-center">
                <div className="font-medium text-gray-700">Q{questionId}</div>
                <div className="text-blue-600 font-bold">{answer}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultsPage