import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ExaminerCandidateManagement() {
  const [candidates, setCandidates] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editId, setEditId] = useState(null);
  const [status, setStatus] = useState('approved');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCandidates();
    // eslint-disable-next-line
  }, []);

  async function fetchCandidates() {
    setLoading(true);
    const res = await axios.get('/api/examiner-candidates', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setCandidates(res.data);
    setLoading(false);
  }

  async function handleAddOrEdit(e) {
    e.preventDefault();
    if (!email) return;
    if (editId) {
      await axios.put(`/api/examiner-candidates/${editId}`, { email, status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } else {
      if (!password) return;
      await axios.post('/api/examiner-candidates', { email, password, status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    setEmail(''); setPassword(''); setEditId(null); setStatus('approved');
    fetchCandidates();
  }

  function startEdit(c) {
    setEditId(c.id);
    setEmail(c.email);
    setStatus(c.status);
    setPassword('');
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete candidate?')) return;
    await axios.delete(`/api/examiner-candidates/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchCandidates();
  }

  return (
    <div>
      <h2>My Candidates</h2>
      <form className="mb-4" onSubmit={handleAddOrEdit}>
        <div className="row g-2">
          <div className="col">
            <input
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Candidate Email"
              required
            />
          </div>
          {!editId && (
            <div className="col">
              <input
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                required
              />
            </div>
          )}
          <div className="col">
            <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary">
              {editId ? "Update" : "Add"}
            </button>
            {editId && (
              <button type="button" className="btn btn-secondary ms-2" onClick={() => { setEditId(null); setEmail(''); setStatus('approved'); }}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Email</th><th>Status</th><th>Created</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map(c => (
              <tr key={c.id}>
                <td>{c.email}</td>
                <td>{c.status}</td>
                <td>{new Date(c.created_at).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-sm btn-info me-1" onClick={() => startEdit(c)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
