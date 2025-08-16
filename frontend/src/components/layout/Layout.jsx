import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

const Layout = ({ 
  title, 
  subtitle, 
  navigation, 
  children, 
  showSidebar = true 
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={title} subtitle={subtitle} />
      
      <div className="flex">
        {showSidebar && <Sidebar navigation={navigation} />}
        
        <main className={`flex-1 ${showSidebar ? 'ml-0' : ''}`}>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout