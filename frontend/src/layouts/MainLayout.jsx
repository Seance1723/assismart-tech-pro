import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import useAuth from '../auth/useAuth'

const MENU = {
  admin: [
    { to: '/admin', label: 'Dashboard', exact: true },
    { to: '/admin/subscription', label: 'Subscription Management' },
    // Add more admin links as needed
  ],
  examiner: [
    { to: '/examiner', label: 'Dashboard', exact: true },
    // Add more examiner links as needed
  ],
  candidate: [
    { to: '/candidate', label: 'Dashboard', exact: true },
    // Add more candidate links as needed
  ]
}

export default function MainLayout() {
  const { role, logout } = useAuth()
  const navigate = useNavigate()
  const menu = MENU[role] || []

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        <aside className="col-12 col-md-3 col-lg-2 bg-light d-flex flex-column py-3 px-2 border-end h-100">
          <h4 className="mb-4 text-primary text-center">Assismart Tech Pro</h4>
          <nav className="flex-grow-1">
            <ul className="nav nav-pills flex-column">
              {menu.map(item => (
                <li className="nav-item mb-1" key={item.to}>
                  <NavLink
                    end={item.exact}
                    to={item.to}
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active" : "")
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <button className="btn btn-outline-danger mt-auto w-100" onClick={handleLogout}>
            Logout
          </button>
        </aside>
        <main className="col bg-white py-4 px-3" style={{ minHeight: "100vh" }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
