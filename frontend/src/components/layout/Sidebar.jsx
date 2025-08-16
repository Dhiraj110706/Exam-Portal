import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = ({ navigation }) => {
  return (
    <div className="bg-white w-64 min-h-screen shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Navigation</h2>
        <nav className="space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => `
                flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${isActive 
                  ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default Sidebar