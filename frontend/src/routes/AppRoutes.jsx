import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import useAuth from '../auth/useAuth'
import LoginPage from '../auth/LoginPage'
import MainLayout from '../layouts/MainLayout'
import AdminDashboard from '../features/admin/AdminDashboard'
import ExaminerDashboard from '../features/examiner/ExaminerDashboard'
import CandidateDashboard from '../features/candidate/CandidateDashboard'

export default function AppRoutes() {
  const { token, role } = useAuth()

  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {role === 'admin' && (
          <Route path="admin" element={<AdminDashboard />} />
        )}
        {role === 'examiner' && (
          <Route path="examiner" element={<ExaminerDashboard />} />
        )}
        {role === 'candidate' && (
          <Route path="candidate" element={<CandidateDashboard />} />
        )}
        <Route path="/" element={<Navigate to={`/${role}`} replace />} />
        <Route path="*" element={<Navigate to={`/${role}`} replace />} />
      </Route>
    </Routes>
  )
}
