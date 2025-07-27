import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from './useAuth'
import { login as loginApi } from '../api/authApi'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const { login }               = useAuth()
  const navigate                = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res   = await loginApi({ email, password })
      const token = res.data.token
      const payload = JSON.parse(atob(token.split('.')[1]))
      login(token, payload.role)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="login-page">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don’t have an account?{' '}
        <Link to="/register">Register here</Link>
      </p>
    </div>
  )
}
