import React, { useEffect, useState } from 'react';
import useAuth from '../../auth/useAuth';
import axios from 'axios';

export default function ExamManagement() {
  const { token } = useAuth();
  const [exams, setExams] = useState([]);
  const [form, setForm] = useState({
    name: '', description: '', duration_minutes: 60, pass_mark: 40, max_attempts: 1,
    randomize_questions: false, subscription_tier: '', start_datetime: '', end_datetime: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [progressExam, setProgressExam] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [exportData, setExportData] = useState(null);

  useEffect(() => { fetchExams(); }, []);
  async function fetchExams() {
    const res = await axios.get('/api/exams', { headers: { Authorization: `Bearer ${token}` } });
    setExams(res.data);
  }
  function openAdd() {
    setEditing(null);
    setForm({
      name: '', description: '', duration_minutes: 60, pass_mark: 40, max_attempts: 1,
      randomize_questions: false, subscription_tier: '', start_datetime: '', end_datetime: ''
    });
    setShowForm(true);
  }
  function openEdit(exam) {
    setEditing(exam);
    setForm({ ...exam });
    setShowForm(true);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (editing) {
      await axios.put(`/api/exams/${editing.id}`, form, { headers: { Authorization: `Bearer ${token}` } });
    } else {
      await axios.post('/api/exams', form, { headers: { Authorization: `Bearer ${token}` } });
    }
    setShowForm(false);
    fetchExams();
  }
  async function handleDelete(id) {
    if (window.confirm('Delete this exam?')) {
      await axios.delete(`/api/exams/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchExams();
    }
  }
  async function viewProgress(id) {
    setProgressExam(id);
    const res = await axios.get(`/api/exams/${id}/progress`, { headers: { Authorization: `Bearer ${token}` } });
    setProgressData(res.data);
  }
  async function exportResults(id) {
    const res = await axios.get(`/api/exams/${id}/export`, { headers: { Authorization: `Bearer ${token}` } });
    setExportData(res.data);
    // TODO: Implement export as Excel/PDF using a client-side library or download endpoint
    alert('Export (see console for data)');
    console.log(res.data);
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Exam Management</h2>
      <button className="btn btn-primary mb-2" onClick={openAdd}>Add Exam</button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th><th>Duration</th><th>Pass Mark</th><th>Attempts</th>
            <th>Random?</th><th>Tier</th><th>Start</th><th>End</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {exams.map(e => (
            <tr key={e.id}>
              <td>{e.name}</td>
              <td>{e.duration_minutes} min</td>
              <td>{e.pass_mark}</td>
              <td>{e.max_attempts}</td>
              <td>{e.randomize_questions ? "Yes" : "No"}</td>
              <td>{e.subscription_tier}</td>
              <td>{e.start_datetime}</td>
              <td>{e.end_datetime}</td>
              <td>
                <button className="btn btn-sm btn-outline-dark me-1" onClick={() => openEdit(e)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger me-1" onClick={() => handleDelete(e.id)}>Delete</button>
                <button className="btn btn-sm btn-outline-info me-1" onClick={() => viewProgress(e.id)}>Progress</button>
                <button className="btn btn-sm btn-outline-success" onClick={() => exportResults(e.id)}>Export</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Exam Modal */}
      {showForm && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">{editing ? "Edit" : "Add"} Exam</h5>
                <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
              </div>
              <div className="modal-body">
                {[
                  { name: "name", label: "Name" }, { name: "description", label: "Description" },
                  { name: "duration_minutes", label: "Duration (min)", type: "number" },
                  { name: "pass_mark", label: "Pass Mark", type: "number" },
                  { name: "max_attempts", label: "Attempts Allowed", type: "number" },
                  { name: "randomize_questions", label: "Randomize Questions", type: "checkbox" },
                  { name: "subscription_tier", label: "Subscription Tier" },
                  { name: "start_datetime", label: "Start DateTime", type: "datetime-local" },
                  { name: "end_datetime", label: "End DateTime", type: "datetime-local" }
                ].map(f => (
                  <div className="mb-2" key={f.name}>
                    <label className="form-label">{f.label}</label>
                    <input
                      className="form-control"
                      type={f.type || "text"}
                      name={f.name}
                      value={f.type === 'checkbox'
                        ? undefined
                        : form[f.name] || ''}
                      checked={f.type === 'checkbox' ? !!form[f.name] : undefined}
                      onChange={e =>
                        setForm(ff => ({
                          ...ff,
                          [f.name]: f.type === 'checkbox'
                            ? e.target.checked
                            : e.target.value
                        }))
                      }
                    />
                  </div>
                ))}
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

      {/* Progress Modal */}
      {progressExam && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Real-Time Progress</h5>
                <button type="button" className="btn-close" onClick={() => setProgressExam(null)}></button>
              </div>
              <div className="modal-body">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Name</th><th>Email</th><th>Status</th><th>Attempts</th>
                      <th>Score</th><th>Started</th><th>Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {progressData.map(row => (
                      <tr key={row.id}>
                        <td>{row.name}</td>
                        <td>{row.email}</td>
                        <td>{row.status}</td>
                        <td>{row.attempts}</td>
                        <td>{row.score}</td>
                        <td>{row.started_at}</td>
                        <td>{row.completed_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}

    </div>
  );
}
