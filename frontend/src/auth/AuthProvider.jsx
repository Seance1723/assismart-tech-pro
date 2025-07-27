import React, { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [role, setRole]   = useState(() => localStorage.getItem('role'))

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      localStorage.setItem('role', role)
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
    }
  }, [token, role])

  const login = (jwt, userRole) => {
    setToken(jwt)
    setRole(userRole)
  }
  const logout = () => {
    setToken(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
