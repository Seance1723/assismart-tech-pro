import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from './useAuth'
import { register as registerApi } from '../api/authApi'

export default function RegisterPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const { login }               = useAuth()
  const navigate                = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res   = await registerApi({ email, password })
      const token = res.data.token
      const payload = JSON.parse(atob(token.split('.')[1]))
      login(token, payload.role)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="register-page">
      <h2>Register</h2>
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
        <button type="submit">Create Account</button>
      </form>
      <p>
        Already have an account?{' '}
        <Link to="/login">Login here</Link>
      </p>
    </div>
  )
}
