// import React, { useState } from 'react'
// import { UserPlus, Search, Eye, EyeOff } from 'lucide-react'
// import  Card  from '@components/common/Card'
// import  Button  from '@components/common/Button'
// import  Input  from '@components/common/Input'
// import  Modal  from '@components/common/Modal'
// import Alert from '@components/common/Alert'
// import { useUsers } from '@hooks/useUsers'

// const UserManagementPage = () => {
//   const [showCreateUser, setShowCreateUser] = useState(false)
//   const [searchTerm, setSearchTerm] = useState('')
//   const { users, loading, error, createUser } = useUsers()

//   const filteredUsers = users.filter(user => 
//     user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (user.student_id && user.student_id.toLowerCase().includes(searchTerm.toLowerCase()))
//   )

//   const handleCreateUser = async (userData) => {
//     try {
//       await createUser(userData)
//       setShowCreateUser(false)
//     } catch (error) {
//       // Error is handled by the hook
//     }
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
//           <p className="text-gray-600">Create and manage student accounts</p>
//         </div>
//         <Button
//           onClick={() => setShowCreateUser(true)}
//         >
//           <UserPlus className="w-4 h-4 mr-2" />
//           Add Student
//         </Button>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <Alert type="error" message={error} />
//       )}

//       {/* Search */}
//       <Card>
//         <div className="p-6">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <Input
//               type="text"
//               placeholder="Search students by username, email, or student ID..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//         </div>
//       </Card>

//       {/* Users List */}
//       <Card>
//         <div className="p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold">Students</h3>
//             <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
//               {filteredUsers.length} students
//             </span>
//           </div>

//           {loading ? (
//             <div className="space-y-4">
//               {[...Array(5)].map((_, i) => (
//                 <div key={i} className="animate-pulse">
//                   <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
//                     <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
//                     <div className="flex-1">
//                       <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
//                       <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : filteredUsers.length === 0 ? (
//             <div className="text-center py-12">
//               <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-500 text-lg mb-2">No Students Found</p>
//               <p className="text-gray-400">Create your first student account to get started</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {filteredUsers.map((user) => (
//                 <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
//                   <div className="flex items-center space-x-4">
//                     <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                       <span className="text-blue-600 font-medium text-sm">
//                         {user.first_name ? user.first_name[0] : user.username[0]}
//                       </span>
//                     </div>
//                     <div>
//                       <div className="flex items-center space-x-2">
//                         <h4 className="font-medium text-gray-900">
//                           {user.first_name && user.last_name 
//                             ? `${user.first_name} ${user.last_name}`
//                             : user.username
//                           }
//                         </h4>
//                         <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
//                           {user.role}
//                         </span>
//                       </div>
//                       <div className="flex items-center space-x-4 text-sm text-gray-500">
//                         <span>@{user.username}</span>
//                         <span>{user.email}</span>
//                         {user.student_id && (
//                           <span className="bg-gray-100 px-2 py-1 rounded text-xs">
//                             ID: {user.student_id}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Button size="small" variant="outline">
//                       View Details
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </Card>

//       {/* Create User Modal */}
//       <Modal
//         isOpen={showCreateUser}
//         onClose={() => setShowCreateUser(false)}
//         title="Create New Student"
//         size="medium"
//       >
//         <CreateUserForm
//           onSubmit={handleCreateUser}
//           onCancel={() => setShowCreateUser(false)}
//           loading={loading}
//         />
//       </Modal>
//     </div>
//   )
// }

// // Create User Form Component
// const CreateUserForm = ({ onSubmit, onCancel, loading }) => {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     first_name: '',
//     last_name: '',
//     role: 'STUDENT'
//   })
//   const [showPassword, setShowPassword] = useState(false)
//   const [errors, setErrors] = useState({})

//   const handleSubmit = (e) => {
//     e.preventDefault()
    
//     // Validate
//     const newErrors = {}
//     if (!formData.username.trim()) newErrors.username = 'Username is required'
//     if (!formData.email.trim()) newErrors.email = 'Email is required'
//     if (!formData.password.trim()) newErrors.password = 'Password is required'
//     if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'

//     setErrors(newErrors)

//     if (Object.keys(newErrors).length === 0) {
//       onSubmit(formData)
//     }
//   }

//   const handleChange = (field, value) => {
//     setFormData({ ...formData, [field]: value })
//     if (errors[field]) {
//       setErrors({ ...errors, [field]: '' })
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="grid grid-cols-2 gap-4">
//         <Input
//           label="First Name"
//           value={formData.first_name}
//           onChange={(e) => handleChange('first_name', e.target.value)}
//           placeholder="Enter first name"
//         />
//         <Input
//           label="Last Name"
//           value={formData.last_name}
//           onChange={(e) => handleChange('last_name', e.target.value)}
//           placeholder="Enter last name"
//         />
//       </div>

//       <Input
//         label="Username"
//         value={formData.username}
//         onChange={(e) => handleChange('username', e.target.value)}
//         error={errors.username}
//         placeholder="Enter username"
//         required
//       />

//       <Input
//         label="Email"
//         type="email"
//         value={formData.email}
//         onChange={(e) => handleChange('email', e.target.value)}
//         error={errors.email}
//         placeholder="Enter email address"
//         required
//       />

//       <div className="relative">
//         <Input
//           label="Password"
//           type={showPassword ? 'text' : 'password'}
//           value={formData.password}
//           onChange={(e) => handleChange('password', e.target.value)}
//           error={errors.password}
//           placeholder="Enter password"
//           required
//           className="pr-12"
//         />
//         <button
//           type="button"
//           onClick={() => setShowPassword(!showPassword)}
//           className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
//         >
//           {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//         </button>
//       </div>

//       <div className="flex justify-end space-x-3 pt-4">
//         <Button
//           type="button"
//           variant="outline"
//           onClick={onCancel}
//         >
//           Cancel
//         </Button>
//         <Button
//           type="submit"
//           loading={loading}
//         >
//           Create Student
//         </Button>
//       </div>
//     </form>
//   )
// }

// export default UserManagementPage

import React, { useState } from 'react'
import { UserPlus, Search, Users, Shield, Upload } from 'lucide-react'
import Card from '@components/common/Card'
import Button from '@components/common/Button'
import Input from '@components/common/Input'
import Modal from '@components/common/Modal'
import Alert from '@components/common/Alert'
import Table from '@components/common/Table'
import { useUsers } from '@hooks/useUsers'
import CreateUserForm from '@components/admin/CreateUserForm'
import BulkStudentImport from '@components/admin/BulkStudentImport'
import { formatDate } from '@utils/helpers'

const UserManagementPage = () => {
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [showBulkImport, setShowBulkImport] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('ALL')
  const [successMessage, setSuccessMessage] = useState('')

  const { users, loading, createUser } = useUsers()

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (user.student_id && user.student_id.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesRole = filterRole === 'ALL' || user.role === filterRole
    
    return matchesSearch && matchesRole
  })

  const handleCreateUser = async (userData) => {
    try {
      const result = await createUser(userData)
      setShowCreateUser(false)
      setSuccessMessage(result.message)
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error) {
      // Error is handled by the hook and CreateUserForm
    }
  }

  const handleBulkImport = (message, count) => {
    setShowBulkImport(false)
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 5000)
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
          {user.student_id || '-'}
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
          <Button size="small" variant="outline">
            Edit
          </Button>
          <Button size="small" variant="danger">
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
          <Button onClick={() => setShowCreateUser(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Create User
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert type="success" message={successMessage} />
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
    </div>
  )
}

export default UserManagementPage