import React from 'react'
import { LogOut, User } from 'lucide-react'
import { useAuth } from '@contexts/AuthContext'
import Button from '@components/common/Button'

const Header = ({ title, subtitle }) => {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout()
    }
  }

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>{user?.username}</span>
            {user?.student_id && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                {user.student_id}
              </span>
            )}
            <span className={`px-2 py-1 rounded text-xs ${
              user?.role === 'ADMIN' 
                ? 'bg-purple-100 text-purple-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {user?.role}
            </span>
          </div>
          
          <Button
            variant="secondary"
            size="small"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Header