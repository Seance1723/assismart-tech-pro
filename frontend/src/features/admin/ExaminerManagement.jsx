import React, { useEffect, useState } from 'react';
import useAuth from '../../auth/useAuth';
import axios from 'axios';
import {
  getExaminers, createExaminer, updateExaminer, deleteExaminer, getExaminerLog
} from '../../api/examinerApi';

export default function ExaminerManagement() {
  const { token } = useAuth();
  const [examiners, setExaminers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    email: '', password: '',
    max_candidates: '', max_exams: '', max_storage_mb: '',
    permissions: ''
  });
  const [activityLog, setActivityLog] = useState([]);
  const [showLogFor, setShowLogFor] = useState(null);

  useEffect(() => { fetchExaminers(); }, []);
  async function fetchExaminers() {
    const res = await getExaminers(token);
    setExaminers(res.data);
  }
  function openAddForm() {
    setEditing(null);
    setForm({ email: '', password: '', max_candidates: '', max_exams: '', max_storage_mb: '', permissions: '' });
    setShowForm(true);
  }
  function openEditForm(e) {
    setEditing(e);
    setForm({ ...e, password: '' });
    setShowForm(true);
  }
  async function handleDelete(id) {
    if (window.confirm('Delete this examiner?')) {
      await deleteExaminer(id, token);
      fetchExaminers();
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (editing) {
      await updateExaminer(editing.id, form, token);
    } else {
      await createExaminer(form, token);
    }
    setShowForm(false);
    fetchExaminers();
  }
  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }
  async function openLog(id) {
    const res = await getExaminerLog(id, token);
    setActivityLog(res.data);
    setShowLogFor(id);
  }
  async function approveExaminer(id) {
    await axios.post(`/api/examiners/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
    fetchExaminers();
  }
  async function suspendExaminer(id) {
    await axios.post(`/api/examiners/${id}/suspend`, {}, { headers: { Authorization: `Bearer ${token}` } });
    fetchExaminers();
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Examiner Management</h2>
      <button className="btn btn-primary mb-3" onClick={openAddForm}>Add Examiner</button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Email</th>
            <th>Status</th>
            <th>Max Candidates</th>
            <th>Max Exams</th>
            <th>Max Storage (MB)</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {examiners.map(e => (
            <tr key={e.id}>
              <td>{e.email}</td>
              <td>
                {e.status === 'pending' && <span className="badge bg-warning text-dark">Pending</span>}
                {e.status === 'approved' && <span className="badge bg-success">Approved</span>}
                {e.status === 'suspended' && <span className="badge bg-danger">Suspended</span>}
              </td>
              <td>{e.max_candidates}</td>
              <td>{e.max_exams}</td>
              <td>{e.max_storage_mb}</td>
              <td>{e.permissions}</td>
              <td>
                <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => openEditForm(e)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger me-1" onClick={() => handleDelete(e.id)}>Delete</button>
                <button className="btn btn-sm btn-outline-info me-1" onClick={() => openLog(e.id)}>Log</button>
                {e.status !== 'approved' && (
                  <button className="btn btn-sm btn-success me-1" onClick={() => approveExaminer(e.id)}>Approve</button>
                )}
                {e.status !== 'suspended' && (
                  <button className="btn btn-sm btn-warning" onClick={() => suspendExaminer(e.id)}>Suspend</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Examiner Modal */}
      {showForm && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">{editing ? 'Edit' : 'Add'} Examiner</h5>
                <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <label className="form-label">Email</label>
                  <input className="form-control" name="email" value={form.email} onChange={handleChange} required />
                </div>
                {!editing && (
                  <div className="mb-2">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required />
                  </div>
                )}
                <div className="mb-2">
                  <label className="form-label">Max Candidates</label>
                  <input type="number" className="form-control" name="max_candidates" value={form.max_candidates || ''} onChange={handleChange} />
                </div>
                <div className="mb-2">
                  <label className="form-label">Max Exams</label>
                  <input type="number" className="form-control" name="max_exams" value={form.max_exams || ''} onChange={handleChange} />
                </div>
                <div className="mb-2">
                  <label className="form-label">Max Storage (MB)</label>
                  <input type="number" className="form-control" name="max_storage_mb" value={form.max_storage_mb || ''} onChange={handleChange} />
                </div>
                <div className="mb-2">
                  <label className="form-label">Permissions</label>
                  <input className="form-control" name="permissions" value={form.permissions || ''} onChange={handleChange} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}

      {/* Examiner Activity Log Modal */}
      {showLogFor && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Examiner Activity Log</h5>
                <button type="button" className="btn-close" onClick={() => setShowLogFor(null)}></button>
              </div>
              <div className="modal-body">
                <ul className="list-group">
                  {activityLog.map(log => (
                    <li key={log.id} className="list-group-item">
                      <strong>{log.activity}:</strong> {log.details} <span className="text-muted float-end">{new Date(log.created_at).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </div>
  );
}
