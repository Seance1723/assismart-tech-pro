import React, { useState } from 'react';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      // Store token in localStorage or context
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/'; // Or use your router to redirect
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded mx-auto" style={{maxWidth: 350, marginTop: '8vh'}}>
      <h2 className="mb-3">Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-2">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="form-control" />
      </div>
      <div className="mb-2">
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" required className="form-control" />
      </div>
      <button type="submit" className="btn btn-primary w-100">Login</button>
    </form>
  );
}
