import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../../auth/useAuth';

export default function CertificateTemplates() {
  const { token } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState({ name: '', html_template: '' });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchTemplates(); }, []);
  async function fetchTemplates() {
    const res = await axios.get('/api/certificates/templates', { headers: { Authorization: `Bearer ${token}` } });
    setTemplates(res.data);
  }
  function openForm(template) {
    setEditId(template?.id || null);
    setForm(template ? { name: template.name, html_template: template.html_template } : { name: '', html_template: '' });
    setShowForm(true);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (editId) {
      await axios.put(`/api/certificates/templates/${editId}`, form, { headers: { Authorization: `Bearer ${token}` } });
    } else {
      await axios.post('/api/certificates/templates', form, { headers: { Authorization: `Bearer ${token}` } });
    }
    setShowForm(false); fetchTemplates();
  }
  async function handleDelete(id) {
    if (window.confirm('Delete template?')) {
      await axios.delete(`/api/certificates/templates/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchTemplates();
    }
  }
  return (
    <div className="container py-4">
      <h2 className="mb-4">Certificate Templates</h2>
      <button className="btn btn-primary mb-2" onClick={() => openForm(null)}>Add Template</button>
      <table className="table table-bordered">
        <thead>
          <tr><th>Name</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {templates.map(t => (
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>
                <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => openForm(t)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(t.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showForm && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <form className="modal-content" onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">{editId ? 'Edit' : 'Add'} Template</h5>
                <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <label className="form-label">Name</label>
                  <input className="form-control" name="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">HTML Template <span className="text-muted">(use {"{candidate_name} {score} {date}"})</span></label>
                  <textarea className="form-control" name="html_template" rows={8}
                    value={form.html_template} onChange={e => setForm(f => ({ ...f, html_template: e.target.value }))} required />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" type="button" onClick={() => setShowForm(false)}>Cancel</button>
                <button className="btn btn-primary" type="submit">Save</button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </div>
  );
}
