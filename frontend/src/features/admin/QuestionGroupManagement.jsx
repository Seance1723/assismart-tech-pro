import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../../auth/useAuth';

export default function QuestionGroupManagement() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [catForm, setCatForm] = useState({ name: '', parent_id: '' });
  const [editCatId, setEditCatId] = useState(null);
  const [showCatForm, setShowCatForm] = useState(false);

  const [qForm, setQForm] = useState({ category_id: '', question_text: '', difficulty: 'medium', tags: '' });
  const [editQId, setEditQId] = useState(null);
  const [showQForm, setShowQForm] = useState(false);

  const [showBulkQ, setShowBulkQ] = useState(false);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => { fetchCategories(); fetchQuestions(); fetchAnalytics(); }, []);

  async function fetchCategories() {
    const res = await axios.get('/api/question-categories', { headers: { Authorization: `Bearer ${token}` } });
    setCategories(res.data);
  }
  async function fetchQuestions() {
    const res = await axios.get('/api/questions', { headers: { Authorization: `Bearer ${token}` } });
    setQuestions(res.data);
  }
  async function fetchAnalytics() {
    const res = await axios.get('/api/questions/analytics', { headers: { Authorization: `Bearer ${token}` } });
    setAnalytics(res.data);
  }

  // Category CRUD
  function openCatForm(cat) {
    setEditCatId(cat ? cat.id : null);
    setCatForm(cat ? { name: cat.name, parent_id: cat.parent_id || '' } : { name: '', parent_id: '' });
    setShowCatForm(true);
  }
  async function handleCatSubmit(e) {
    e.preventDefault();
    if (editCatId) {
      await axios.put(`/api/question-categories/${editCatId}`, catForm, { headers: { Authorization: `Bearer ${token}` } });
    } else {
      await axios.post('/api/question-categories', catForm, { headers: { Authorization: `Bearer ${token}` } });
    }
    setShowCatForm(false);
    fetchCategories();
  }
  async function handleCatDelete(id) {
    if (window.confirm('Delete this category and its subcategories/questions?')) {
      await axios.delete(`/api/question-categories/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchCategories(); fetchQuestions();
    }
  }

  // Question CRUD
  function openQForm(q) {
    setEditQId(q ? q.id : null);
    setQForm(q ? { ...q } : { category_id: '', question_text: '', difficulty: 'medium', tags: '' });
    setShowQForm(true);
  }
  async function handleQSubmit(e) {
    e.preventDefault();
    if (editQId) {
      await axios.put(`/api/questions/${editQId}`, qForm, { headers: { Authorization: `Bearer ${token}` } });
    } else {
      await axios.post('/api/questions', qForm, { headers: { Authorization: `Bearer ${token}` } });
    }
    setShowQForm(false);
    fetchQuestions(); fetchAnalytics();
  }
  async function handleQDelete(id) {
    if (window.confirm('Delete this question?')) {
      await axios.delete(`/api/questions/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchQuestions(); fetchAnalytics();
    }
  }

  // Bulk Upload
  async function handleBulkQUpload(e) {
    e.preventDefault();
    setBulkUploading(true);
    const file = e.target.elements.file.files[0];
    const formData = new FormData();
    formData.append('file', file);
    await axios.post('/api/questions/bulk-upload', formData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setBulkUploading(false);
    setShowBulkQ(false);
    fetchQuestions();
    fetchAnalytics();
  }

  // Render
  const mainCats = categories.filter(c => !c.parent_id);
  const subCats = categories.filter(c => c.parent_id);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Question Group Management</h2>
      {/* Category Management */}
      <div className="mb-4">
        <h5>Categories & Subcategories</h5>
        <button className="btn btn-primary btn-sm mb-2" onClick={() => openCatForm(null)}>Add Category</button>
        <table className="table table-bordered">
          <thead>
            <tr><th>Category</th><th>Parent</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td>{cat.name}</td>
                <td>{cat.parent_id ? (categories.find(c => c.id === cat.parent_id)?.name || '-') : '-'}</td>
                <td>
                  <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => openCatForm(cat)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleCatDelete(cat.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Question Management */}
      <div className="mb-4">
        <h5>Questions</h5>
        <button className="btn btn-primary btn-sm mb-2" onClick={() => openQForm(null)}>Add Question</button>
        <button className="btn btn-outline-primary btn-sm ms-2 mb-2" onClick={() => setShowBulkQ(true)}>Bulk Upload</button>
        <table className="table table-bordered">
          <thead>
            <tr><th>Text</th><th>Category</th><th>Difficulty</th><th>Tags</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {questions.map(q => (
              <tr key={q.id}>
                <td>{q.question_text.slice(0, 100)}{q.question_text.length > 100 ? '...' : ''}</td>
                <td>{categories.find(c => c.id === q.category_id)?.name || '-'}</td>
                <td>{q.difficulty}</td>
                <td>{q.tags}</td>
                <td>
                  <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => openQForm(q)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleQDelete(q.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Question Analytics */}
      <div className="mb-4">
        <h5>Question Analytics</h5>
        <table className="table table-bordered">
          <thead>
            <tr><th>Text</th><th>Attempts</th><th>Missed</th><th>Avg Time (s)</th></tr>
          </thead>
          <tbody>
            {analytics.map(a => (
              <tr key={a.id}>
                <td>{a.question_text.slice(0, 100)}{a.question_text.length > 100 ? '...' : ''}</td>
                <td>{a.attempts}</td>
                <td>{a.missed}</td>
                <td>{a.avg_time_sec}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Category Form Modal */}
      {showCatForm && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={handleCatSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">{editCatId ? 'Edit' : 'Add'} Category</h5>
                <button type="button" className="btn-close" onClick={() => setShowCatForm(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <label className="form-label">Name</label>
                  <input className="form-control" name="name" value={catForm.name} onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">Parent Category</label>
                  <select className="form-select" name="parent_id" value={catForm.parent_id || ''} onChange={e => setCatForm(f => ({ ...f, parent_id: e.target.value }))}>
                    <option value="">None</option>
                    {mainCats.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" type="button" onClick={() => setShowCatForm(false)}>Cancel</button>
                <button className="btn btn-primary" type="submit">Save</button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
      {/* Question Form Modal */}
      {showQForm && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={handleQSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">{editQId ? 'Edit' : 'Add'} Question</h5>
                <button type="button" className="btn-close" onClick={() => setShowQForm(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <label className="form-label">Category</label>
                  <select className="form-select" name="category_id" value={qForm.category_id} onChange={e => setQForm(f => ({ ...f, category_id: e.target.value }))} required>
                    <option value="">Select</option>
                    {categories.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label">Question</label>
                  <textarea className="form-control" name="question_text" value={qForm.question_text} onChange={e => setQForm(f => ({ ...f, question_text: e.target.value }))} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">Difficulty</label>
                  <select className="form-select" name="difficulty" value={qForm.difficulty} onChange={e => setQForm(f => ({ ...f, difficulty: e.target.value }))}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label">Tags (comma separated)</label>
                  <input className="form-control" name="tags" value={qForm.tags} onChange={e => setQForm(f => ({ ...f, tags: e.target.value }))} />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" type="button" onClick={() => setShowQForm(false)}>Cancel</button>
                <button className="btn btn-primary" type="submit">Save</button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
      {/* Bulk Question Upload Modal */}
      {showBulkQ && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={handleBulkQUpload}>
              <div className="modal-header">
                <h5 className="modal-title">Bulk Upload Questions (CSV)</h5>
                <button type="button" className="btn-close" onClick={() => setShowBulkQ(false)}></button>
              </div>
              <div className="modal-body">
                <input type="file" name="file" accept=".csv" className="form-control" required />
                <small>CSV must have columns: category_id, question_text, difficulty, tags</small>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" type="button" onClick={() => setShowBulkQ(false)}>Cancel</button>
                <button className="btn btn-primary" type="submit" disabled={bulkUploading}>{bulkUploading ? 'Uploading...' : 'Upload'}</button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </div>
  );
}
