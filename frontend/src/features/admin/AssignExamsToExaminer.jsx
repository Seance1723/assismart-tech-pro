import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AssignExamsToExaminer() {
  const [examiners, setExaminers] = useState([]);
  const [exams, setExams] = useState([]);
  const [groups, setGroups] = useState([]);
  const [subgroups, setSubgroups] = useState([]);
  const [selectedExaminer, setSelectedExaminer] = useState('');
  const [selectedExams, setSelectedExams] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedSubGroups, setSelectedSubGroups] = useState([]);
  const [msg, setMsg] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchData() {
      const [examinersRes, examsRes, groupsRes, subgroupsRes] = await Promise.all([
        axios.get('/api/examiners', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/exams', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/question-categories', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/question-subgroups', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setExaminers(examinersRes.data);
      setExams(examsRes.data);
      setGroups(groupsRes.data);
      setSubgroups(subgroupsRes.data);
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function handleAssign(e) {
    e.preventDefault();
    setMsg('');
    await axios.post('/api/admin/examiner-assignments', {
      examiner_id: selectedExaminer,
      exams: selectedExams,
      groups: selectedGroups,
      subgroups: selectedSubGroups
    }, { headers: { Authorization: `Bearer ${token}` } });
    setMsg('Assignments updated!');
  }

  return (
    <div>
      <h2>Assign Exams/Groups/Sub-Groups to Examiner</h2>
      <form onSubmit={handleAssign}>
        <div className="mb-3">
          <label>Examiner</label>
          <select className="form-select" value={selectedExaminer} onChange={e => setSelectedExaminer(e.target.value)} required>
            <option value="">Select Examiner</option>
            {examiners.map(e => <option key={e.id} value={e.id}>{e.email}</option>)}
          </select>
        </div>
        <div className="mb-3">
          <label>Exams</label>
          <select className="form-select" multiple value={selectedExams} onChange={e => setSelectedExams(Array.from(e.target.selectedOptions, o => o.value))}>
            {exams.map(exam => <option key={exam.id} value={exam.id}>{exam.title}</option>)}
          </select>
        </div>
        <div className="mb-3">
          <label>Question Groups</label>
          <select className="form-select" multiple value={selectedGroups} onChange={e => setSelectedGroups(Array.from(e.target.selectedOptions, o => o.value))}>
            {groups.map(group => <option key={group.id} value={group.id}>{group.name}</option>)}
          </select>
        </div>
        <div className="mb-3">
          <label>Question Sub-Groups</label>
          <select className="form-select" multiple value={selectedSubGroups} onChange={e => setSelectedSubGroups(Array.from(e.target.selectedOptions, o => o.value))}>
            {subgroups.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" type="submit">Assign</button>
      </form>
      {msg && <div className="alert alert-success mt-3">{msg}</div>}
    </div>
  );
}
