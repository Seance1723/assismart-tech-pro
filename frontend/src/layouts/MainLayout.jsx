import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import useAuth from '../auth/useAuth'

export default function MainLayout() {
  const { role, logout } = useAuth()
  const navigate         = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menu = {
    admin:     [{ to: '/admin',    label: 'Admin Dashboard' }],
    examiner:  [{ to: '/examiner', label: 'Examiner Dashboard' }],
    candidate: [{ to: '/candidate',label: 'Candidate Dashboard' }],
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>Assismart Tech Pro</h2>
        <nav>
          {(menu[role] || []).map(item => (
            <NavLink key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout}>Logout</button>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
