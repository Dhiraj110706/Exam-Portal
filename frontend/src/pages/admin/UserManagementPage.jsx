import React, { useState } from 'react'
import { UserPlus, Search, Users, Shield, Upload, Edit, Trash2 } from 'lucide-react'
import Card from '@components/common/Card'
import Button from '@components/common/Button'
import Input from '@components/common/Input'
import Modal from '@components/common/Modal'
import Alert from '@components/common/Alert'
import Table from '@components/common/Table'
import { useUsers } from '@hooks/useUsers'
import CreateUserForm from '@components/admin/CreateUserForm'
import BulkStudentImport from '@components/admin/BulkStudentImport'
import EditUserForm from '@components/admin/EditUserForm'
import { formatDate } from '@utils/helpers'

const UserManagementPage = () => {
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [showBulkImport, setShowBulkImport] = useState(false)
  const [showEditUser, setShowEditUser] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('ALL')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const { users, loading, createUser, updateUser, deleteUser } = useUsers()

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (user.student_id && user.student_id.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesRole = filterRole === 'ALL' || user.role === filterRole
    
    return matchesSearch && matchesRole
  })

  const showSuccessMessage = (message) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 5000)
  }

  const showErrorMessage = (message) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(''), 5000)
  }

  const handleCreateUser = async (userData) => {
    try {
      const result = await createUser(userData)
      setShowCreateUser(false)
      showSuccessMessage(result.message)
    } catch (error) {
      // Error is handled by the hook and CreateUserForm
    }
  }

  const handleBulkImport = (message, count) => {
    setShowBulkImport(false)
    showSuccessMessage(message)
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setShowEditUser(true)
  }

  const handleUpdateUser = async (userData) => {
    try {
      const result = await updateUser(selectedUser.id, userData)
      setShowEditUser(false)
      setSelectedUser(null)
      showSuccessMessage(result.message || 'User updated successfully')
    } catch (error) {
      showErrorMessage(error.message || 'Failed to update user')
    }
  }

  const handleDeleteUser = (user) => {
    setSelectedUser(user)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteUser = async () => {
    try {
      const result = await deleteUser(selectedUser.id)
      setShowDeleteConfirm(false)
      setSelectedUser(null)
      showSuccessMessage(result.message || 'User deleted successfully')
    } catch (error) {
      showErrorMessage(error.message || 'Failed to delete user')
    }
  }

  const userColumns = [
    {
      header: 'Name',
      accessor: 'name',
      render: (user) => (
        <div>
          <div className="font-medium text-gray-900">
            {user.first_name} {user.last_name}
          </div>
          <div className="text-sm text-gray-500">@{user.username}</div>
        </div>
      )
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (user) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.role === 'ADMIN' 
            ? 'bg-purple-100 text-purple-800'
            : 'bg-blue-100 text-blue-800'
        }`}>
          {user.role === 'ADMIN' ? (
            <Shield className="w-3 h-3 mr-1" />
          ) : (
            <Users className="w-3 h-3 mr-1" />
          )}
          {user.role}
        </span>
      )
    },
    {
      header: 'Student ID',
      accessor: 'student_id',
      render: (user) => (
        <span className="text-sm text-gray-900">
          {user.student_id || ''}
        </span>
      )
    },
    {
      header: 'Email',
      accessor: 'email',
      render: (user) => (
        <span className="text-sm text-gray-600">
          {user.email || '-'}
        </span>
      )
    },
    {
      header: 'Created',
      accessor: 'date_joined',
      render: (user) => (
        <span className="text-sm text-gray-500">
          {formatDate(user.date_joined)}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (user) => (
        <div className="flex space-x-2">
          <Button 
            size="small" 
            variant="outline"
            onClick={() => handleEditUser(user)}
            className="flex items-center"
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button 
            size="small" 
            variant="danger"
            onClick={() => handleDeleteUser(user)}
            className="flex items-center"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Delete
          </Button>
        </div>
      )
    }
  ]

  const totalStudents = users.filter(u => u.role === 'STUDENT').length
  const totalAdmins = users.filter(u => u.role === 'ADMIN').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage students and administrators</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => setShowBulkImport(true)}
            variant="outline"
          >
            <Upload className="w-4 h-4 mr-2" />
            Bulk Import
          </Button>
          <Button onClick={() => setShowCreateUser(true)} variant="success">
            <UserPlus className="w-4 h-4 mr-2" />
            Create User
          </Button>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Students</p>
              <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Administrators</p>
              <p className="text-2xl font-bold text-gray-900">{totalAdmins}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search users by name, username, email, or student ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="ALL">All Roles</option>
                <option value="STUDENT">Students Only</option>
                <option value="ADMIN">Admins Only</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Users ({filteredUsers.length})
            </h3>
          </div>
          <Table
            columns={userColumns}
            data={filteredUsers}
            loading={loading}
            emptyMessage="No users found matching your criteria"
          />
        </div>
      </Card>

      {/* Bulk Import Modal */}
      <Modal
        isOpen={showBulkImport}
        onClose={() => setShowBulkImport(false)}
        title="Bulk Import Students"
        size="large"
      >
        <BulkStudentImport
          onImportComplete={handleBulkImport}
          onCancel={() => setShowBulkImport(false)}
        />
      </Modal>

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateUser}
        onClose={() => setShowCreateUser(false)}
        title="Create New User"
        size="large"
      >
        <CreateUserForm
          onCreateUser={handleCreateUser}
          onCancel={() => setShowCreateUser(false)}
        />
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditUser}
        onClose={() => {
          setShowEditUser(false)
          setSelectedUser(null)
        }}
        title="Edit User"
        size="large"
      >
        {selectedUser && (
          <EditUserForm
            user={selectedUser}
            onUpdateUser={handleUpdateUser}
            onCancel={() => {
              setShowEditUser(false)
              setSelectedUser(null)
            }}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setSelectedUser(null)
        }}
        title="Confirm Delete"
        size="small"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Delete User
              </h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete{' '}
                <span className="font-medium">
                  {selectedUser.first_name} {selectedUser.last_name} (@{selectedUser.username})
                </span>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setSelectedUser(null)
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDeleteUser}
              >
                Delete User
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default UserManagementPage