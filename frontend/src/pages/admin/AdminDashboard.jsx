import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  Settings,
  FileText,
  UserPlus
} from 'lucide-react'
import Layout from '@components/layout/Layout'
import QuestionsExamsPage from './QuestionsExamsPage'
import UserManagementPage from './UserManagementPage'
import ResultsPage from './ResultsPage'
import DashboardOverview from './DashboardOverview'

const AdminDashboard = () => {
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Questions & Exams', href: '/admin/questions', icon: BookOpen },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Results', href: '/admin/results', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <Layout
      title="Admin Dashboard"
      subtitle="Manage exams, users, and monitor results"
      navigation={navigation}
    >
      <Routes>
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/questions" element={<QuestionsExamsPage />} />
        <Route path="/users" element={<UserManagementPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/settings" element={<div className="p-8 text-center text-gray-500">Settings coming soon...</div>} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Layout>
  )
}

export default AdminDashboard