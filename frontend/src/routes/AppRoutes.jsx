import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import useAuth from '../auth/useAuth'
import LoginPage from '../auth/LoginPage'
import RegisterPage from '../auth/RegisterPage'
import MainLayout from '../layouts/MainLayout'

// ADMIN
import AdminDashboard from '../features/admin/AdminDashboard'
import SubscriptionManagement from '../features/admin/SubscriptionManagement'
import ExaminerManagement from '../features/admin/ExaminerManagement'
import CandidateManagement from '../features/admin/CandidateManagement'
import ExamManagement from '../features/admin/ExamManagement'

// EXAMINER
import ExaminerDashboard from '../features/examiner/ExaminerDashboard'
import WelcomePage from '../features/examiner/WelcomePage'

// CANDIDATE
import CandidateDashboard from '../features/candidate/CandidateDashboard'

export default function AppRoutes() {
  const { token, role, user } = useAuth() // assume user includes examiner status/quota

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
            <Route path="admin/examiners" element={<ExaminerManagement />} />
            <Route path="admin/candidates" element={<CandidateManagement />} />
            <Route path="admin/exams" element={<ExamManagement />} />
            {/* Add more admin routes here */}
          </>
        )}

        {/* EXAMINER ROUTES */}
        {role === 'examiner' && (
          <>
            <Route
              path="examiner"
              element={
                user?.status === 'approved'
                  ? <ExaminerDashboard />
                  : <WelcomePage />
              }
            />
            {/* You can add more examiner routes here */}
          </>
        )}

        {/* CANDIDATE ROUTES */}
        {role === 'candidate' && (
          <>
            <Route path="candidate" element={<CandidateDashboard />} />
            {/* Add more candidate routes here */}
          </>
        )}

        {/* Default and fallback */}
        <Route path="/" element={<Navigate to={`/${role}`} replace />} />
        <Route path="*" element={<Navigate to={`/${role}`} replace />} />
      </Route>
    </Routes>
  )
}
