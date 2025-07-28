import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../../auth/useAuth';

export default function AssignExamToCandidate() {
  const { token } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [exams, setExams] = useState([]);
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({
    candidate_id: '', exam_id: '', category_id: '', question_ids: []
  });

  useEffect(() => {
    fetchAll();
  }, []);
  async function fetchAll() {
    const [candRes, examRes, catRes] = await Promise.all([
      axios.get('/api/candidates', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('/api/exams', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('/api/question-categories', { headers: { Authorization: `Bearer ${token}` } }),
    ]);
    setCandidates(candRes.data);
    setExams(examRes.data);
    setCategories(catRes.data);
  }
  async function fetchQuestionsForCategory(category_id) {
    if (!category_id) { setQuestions([]); return; }
    const res = await axios.get('/api/questions?category_id=' + category_id, { headers: { Authorization: `Bearer ${token}` } });
    setQuestions(res.data);
  }

  // When category changes, load relevant questions
  useEffect(() => { if (form.category_id) fetchQuestionsForCategory(form.category_id); }, [form.category_id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }
  function handleQuestionChange(e) {
    const options = Array.from(e.target.selectedOptions).map(o => o.value);
    setForm(f => ({ ...f, question_ids: options.map(Number) }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    await axios.post('/api/exam-assignments/assign', form, { headers: { Authorization: `Bearer ${token}` } });
    alert('Exam assigned!');
    setForm({ candidate_id: '', exam_id: '', category_id: '', question_ids: [] });
  }

  // Category + subcategory as one dropdown (label with subcats indented)
  const catOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.parent_id
      ? `— ${cat.name}`
      : cat.name
  }));

  return (
    <div className="container py-4">
      <h2 className="mb-4">Assign Exam to Candidate</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="form-label">Candidate</label>
          <select className="form-select" name="candidate_id" value={form.candidate_id} onChange={handleChange} required>
            <option value="">Select Candidate</option>
            {candidates.map(c => <option value={c.id} key={c.id}>{c.name} ({c.email})</option>)}
          </select>
        </div>
        <div className="mb-2">
          <label className="form-label">Exam</label>
          <select className="form-select" name="exam_id" value={form.exam_id} onChange={handleChange} required>
            <option value="">Select Exam</option>
            {exams.map(e => <option value={e.id} key={e.id}>{e.name}</option>)}
          </select>
        </div>
        <div className="mb-2">
          <label className="form-label">Question Group/Subcategory</label>
          <select className="form-select" name="category_id" value={form.category_id} onChange={handleChange} required>
            <option value="">Select Category/Subcategory</option>
            {catOptions.map(opt => <option value={opt.value} key={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div className="mb-2">
          <label className="form-label">Select Questions (hold Ctrl/Cmd for multiple)</label>
          <select className="form-select" multiple size={6} value={form.question_ids.map(String)} onChange={handleQuestionChange} required>
            {questions.map(q => (
              <option value={q.id} key={q.id}>{q.question_text.slice(0, 60)}</option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <button className="btn btn-primary" type="submit" disabled={!form.candidate_id || !form.exam_id || !form.category_id || !form.question_ids.length}>
            Assign
          </button>
        </div>
      </form>
    </div>
  );
}
