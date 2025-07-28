import React, { useState } from 'react';
import axios from 'axios';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/auth/register', { email, password });
      setSuccess('Registered successfully! You can now login.');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded mx-auto" style={{maxWidth: 350, marginTop: '8vh'}}>
      <h2 className="mb-3">Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="mb-2">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="form-control" />
      </div>
      <div className="mb-2">
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" required className="form-control" />
      </div>
      <button type="submit" className="btn btn-primary w-100">Register</button>
    </form>
  );
}
