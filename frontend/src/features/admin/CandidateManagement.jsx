import React, { useEffect, useState } from 'react';
import useAuth from '../../auth/useAuth';
import {
  getCandidates, createCandidate, updateCandidate, deleteCandidate,
  bulkImportCandidates, bulkUploadCandidatesFile, getCandidateProgress, getCandidatesAnalytics
} from '../../api/candidateApi';

import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';

export default function CandidateManagement() {
  const { token } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    email: '', name: '', phone: '', dob: '', gender: '', address: '', examiner_id: '', status: 'active',
    highest_qualification: '', skills: '', profile_pic: '', guardian_name: '', notes: ''
  });
  const [showBulk, setShowBulk] = useState(false);
  const [bulkData, setBulkData] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState([]);
  const [progressFor, setProgressFor] = useState(null);
  const [quickView, setQuickView] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => { fetchCandidates(); fetchAnalytics(); }, []);
  async function fetchCandidates() {
    const res = await getCandidates(token);
    setCandidates(res.data);
  }
  async function fetchAnalytics() {
    const res = await getCandidatesAnalytics(token);
    setAnalytics(res.data);
  }
  function openAddForm() {
    setEditing(null);
    setForm({
      email: '', name: '', phone: '', dob: '', gender: '', address: '', examiner_id: '', status: 'active',
      highest_qualification: '', skills: '', profile_pic: '', guardian_name: '', notes: ''
    });
    setShowForm(true);
  }
  function openEditForm(c) {
    setEditing(c);
    setForm({ ...c });
    setShowForm(true);
  }
  async function handleDelete(id) {
    if (window.confirm('Delete this candidate?')) {
      await deleteCandidate(id, token);
      fetchCandidates();
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (editing) {
      await updateCandidate(editing.id, form, token);
    } else {
      await createCandidate(form, token);
    }
    setShowForm(false);
    fetchCandidates();
    fetchAnalytics();
  }
  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }
  // Bulk import from CSV or JSON array
  async function handleBulkImport(e) {
    e.preventDefault();
    try {
      let data = [];
      if (bulkData.startsWith('[')) {
        data = JSON.parse(bulkData);
      } else {
        // CSV: email,name,phone,dob,gender,address,examiner_id,status,...
        const [header, ...lines] = bulkData.split('\n');
        const keys = header.split(',');
        data = lines.filter(x => x.trim()).map(line => {
          const values = line.split(',');
          const obj = {};
          keys.forEach((k, i) => obj[k.trim()] = values[i]?.trim());
          return obj;
        });
      }
      await bulkImportCandidates(data, token);
      setShowBulk(false);
      fetchCandidates();
      fetchAnalytics();
    } catch (err) {
      alert("Bulk import error: " + err);
    }
  }
  async function handleFileUpload(e) {
    e.preventDefault();
    setUploading(true);
    const file = e.target.elements.file.files[0];
    await bulkUploadCandidatesFile(file, token);
    setUploading(false);
    setShowUpload(false);
    fetchCandidates();
    fetchAnalytics();
  }
  async function openProgress(id) {
    const res = await getCandidateProgress(id, token);
    setProgress(res.data);
    setProgressFor(id);
  }
  function handleExportCSV() {
    if (!candidates.length) return;
    const csv = [
      Object.keys(candidates[0]).join(','),
      ...candidates.map(c => Object.values(c).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'candidates.csv';
    a.click();
  }

  // Fields for advanced profile
  const formFields = [
    { name: 'email', label: 'Email', required: true },
    { name: 'name', label: 'Name', required: true },
    { name: 'phone', label: 'Phone' },
    { name: 'dob', label: 'Date of Birth', type: 'date' },
    { name: 'gender', label: 'Gender' },
    { name: 'address', label: 'Address' },
    { name: 'examiner_id', label: 'Examiner ID' },
    { name: 'status', label: 'Status' },
    { name: 'highest_qualification', label: 'Highest Qualification' },
    { name: 'skills', label: 'Skills' },
    { name: 'profile_pic', label: 'Profile Picture URL' },
    { name: 'guardian_name', label: 'Guardian Name' },
    { name: 'notes', label: 'Notes' },
  ];

  return (
    <div className="container py-4">
      <h2 className="mb-4">Candidate Management</h2>

      {/* Analytics Charts */}
      {analytics && (
        <div className="row mb-4">
          <div className="col-md-4">
            <h5>Status</h5>
            <PieChart width={220} height={220}>
              <Pie data={analytics.byStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={70} label>
                {analytics.byStatus.map((entry, idx) => <Cell key={idx} fill={['#8884d8', '#82ca9d', '#ffbb28'][idx % 3]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
          <div className="col-md-4">
            <h5>Gender</h5>
            <PieChart width={220} height={220}>
              <Pie data={analytics.byGender} dataKey="count" nameKey="gender" cx="50%" cy="50%" outerRadius={70} label>
                {analytics.byGender.map((entry, idx) => <Cell key={idx} fill={['#8884d8', '#ffbb28', '#ff8042'][idx % 3]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
          <div className="col-md-4">
            <h5>Qualification</h5>
            <BarChart width={240} height={220} data={analytics.byQualification}>
              <XAxis dataKey="highest_qualification" />
              <YAxis />
              <Bar dataKey="count" fill="#82ca9d" />
              <Tooltip />
              <Legend />
            </BarChart>
          </div>
        </div>
      )}

      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={openAddForm}>Add Candidate</button>
        <button className="btn btn-outline-secondary" onClick={() => setShowBulk(true)}>Bulk Import (Paste)</button>
        <button className="btn btn-outline-primary ms-2" onClick={() => setShowUpload(true)}>Bulk Upload (CSV)</button>
        <button className="btn btn-outline-success ms-2" onClick={handleExportCSV}>Export CSV</button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Email</th><th>Name</th><th>Phone</th><th>DOB</th><th>Gender</th>
            <th>Qualification</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map(c => (
            <tr key={c.id}>
              <td>{c.email}</td>
              <td>{c.name}</td>
              <td>{c.phone}</td>
              <td>{c.dob}</td>
              <td>{c.gender}</td>
              <td>{c.highest_qualification}</td>
              <td>{c.status}</td>
              <td>
                <button className="btn btn-sm btn-outline-dark me-1" onClick={() => setQuickView(c)}>View</button>
                <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => openEditForm(c)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger me-1" onClick={() => handleDelete(c.id)}>Delete</button>
                <button className="btn btn-sm btn-outline-info" onClick={() => openProgress(c.id)}>Progress</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">{editing ? 'Edit' : 'Add'} Candidate</h5>
                <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
              </div>
              <div className="modal-body">
                {formFields.map(field => (
                  <div className="mb-2" key={field.name}>
                    <label className="form-label">{field.label}</label>
                    <input
                      className="form-control"
                      name={field.name}
                      type={field.type || "text"}
                      value={form[field.name] || ''}
                      onChange={handleChange}
                      required={field.required}
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

      {/* Bulk Import Modal */}
      {showBulk && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <form className="modal-content" onSubmit={handleBulkImport}>
              <div className="modal-header">
                <h5 className="modal-title">Bulk Import Candidates</h5>
                <button type="button" className="btn-close" onClick={() => setShowBulk(false)}></button>
              </div>
              <div className="modal-body">
                <p>Paste JSON array of candidate objects or CSV (header first row):<br />
                  <code>email,name,phone,dob,gender,address,examiner_id,status,highest_qualification,skills,profile_pic,guardian_name,notes</code>
                </p>
                <textarea className="form-control" rows={8} value={bulkData} onChange={e => setBulkData(e.target.value)} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowBulk(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Import</button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}

      {/* Bulk File Upload Modal */}
      {showUpload && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={handleFileUpload}>
              <div className="modal-header">
                <h5 className="modal-title">Bulk Upload Candidates (CSV)</h5>
                <button type="button" className="btn-close" onClick={() => setShowUpload(false)}></button>
              </div>
              <div className="modal-body">
                <input type="file" name="file" accept=".csv" className="form-control" required />
                <small>Upload CSV file. Header row should match candidate fields.</small>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowUpload(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}

      {/* Progress Modal */}
      {progressFor && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Candidate Progress</h5>
                <button type="button" className="btn-close" onClick={() => setProgressFor(null)}></button>
              </div>
              <div className="modal-body">
                {progress.length === 0 ? (
                  <div>No progress data.</div>
                ) : (
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Exam</th><th>Score</th><th>Passed</th><th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {progress.map(p => (
                        <tr key={p.id}>
                          <td>{p.exam_name}</td>
                          <td>{p.score}</td>
                          <td>{p.passed ? "Yes" : "No"}</td>
                          <td>{new Date(p.taken_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}

      {/* Candidate Quick Profile View */}
      {quickView && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Candidate Profile: {quickView.name}</h5>
                <button type="button" className="btn-close" onClick={() => setQuickView(null)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4">
                    {quickView.profile_pic ? (
                      <img src={quickView.profile_pic} alt="Profile" className="img-fluid rounded mb-2" />
                    ) : (
                      <div className="text-muted mb-2">(No profile picture)</div>
                    )}
                    <div><strong>Status:</strong> {quickView.status}</div>
                    <div><strong>Phone:</strong> {quickView.phone}</div>
                    <div><strong>Email:</strong> {quickView.email}</div>
                  </div>
                  <div className="col-md-8">
                    <div><strong>Guardian Name:</strong> {quickView.guardian_name}</div>
                    <div><strong>Qualification:</strong> {quickView.highest_qualification}</div>
                    <div><strong>Skills:</strong> {quickView.skills}</div>
                    <div><strong>Address:</strong> {quickView.address}</div>
                    <div><strong>Notes:</strong> {quickView.notes}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </div>
  );
}
