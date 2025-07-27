import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import useAuth from '../auth/useAuth'
import LoginPage from '../auth/LoginPage'
import RegisterPage from '../auth/RegisterPage'
import MainLayout from '../layouts/MainLayout'
import AdminDashboard from '../features/admin/AdminDashboard'
import SubscriptionManagement from '../features/admin/SubscriptionManagement'
import ExaminerDashboard from '../features/examiner/ExaminerDashboard'
import CandidateDashboard from '../features/candidate/CandidateDashboard'

export default function AppRoutes() {
  const { token, role } = useAuth()

  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* ADMIN ROUTES */}
        {role === 'admin' && (
          <>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/subscription" element={<SubscriptionManagement />} />
            {/* Add more admin routes here */}
          </>
        )}

        {/* EXAMINER ROUTES */}
        {role === 'examiner' && (
          <Route path="examiner" element={<ExaminerDashboard />} />
        )}

        {/* CANDIDATE ROUTES */}
        {role === 'candidate' && (
          <Route path="candidate" element={<CandidateDashboard />} />
        )}

        {/* Default and fallback */}
        <Route path="/" element={<Navigate to={`/${role}`} replace />} />
        <Route path="*" element={<Navigate to={`/${role}`} replace />} />
      </Route>
    </Routes>
  )
}
