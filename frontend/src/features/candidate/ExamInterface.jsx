import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
// You can install screenfull for fullscreen: npm install screenfull
import screenfull from "screenfull";
import { useParams, useNavigate } from "react-router-dom";

export default function ExamInterface() {
  const { exam_id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [progress, setProgress] = useState({});
  const [current, setCurrent] = useState(0);
  const [marked, setMarked] = useState([]);
  const [timer, setTimer] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const intervalRef = useRef();

  useEffect(() => {
    async function fetchExam() {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/candidate-exam/${exam_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExam(res.data.exam);
      setQuestions(res.data.questions);
      setProgress(res.data.progress?.answers || {});
      setTimer(res.data.progress?.remaining_seconds || res.data.exam.duration_seconds || 1800);
      // Fullscreen on load
      if (screenfull.isEnabled) setTimeout(() => screenfull.request(), 400);
    }
    fetchExam();
    // eslint-disable-next-line
  }, [exam_id]);

  // Timer
  useEffect(() => {
    if (timer <= 0) {
      handleSubmit(); // Auto-submit
      return;
    }
    intervalRef.current = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, [timer]);

  // Auto-save every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      saveProgress();
    }, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [progress, timer]);

  async function saveProgress() {
    const token = localStorage.getItem("token");
    await axios.post(`/api/candidate-exam/${exam_id}/progress`, {
      answers: progress,
      remaining_seconds: timer
    }, { headers: { Authorization: `Bearer ${token}` } });
  }

  function handleOption(qid, option) {
    setProgress(prev => ({ ...prev, [qid]: option }));
  }

  function handleMark(qid) {
    setMarked(prev => prev.includes(qid) ? prev.filter(id => id !== qid) : [...prev, qid]);
  }

  async function handleSubmit() {
    if (!window.confirm("Submit exam? You cannot change answers later!")) return;
    setSubmitting(true);
    const token = localStorage.getItem("token");
    const res = await axios.post(`/api/candidate-exam/${exam_id}/submit`, {
      answers: progress
    }, { headers: { Authorization: `Bearer ${token}` } });
    setSubmitting(false);
    navigate(`/candidate/results/${exam_id}/1`); // Assume attempt=1 for now
  }

  if (!exam) return <div>Loading...</div>;

  const q = questions[current];
  const min = Math.floor(timer / 60), sec = timer % 60;

  return (
    <div className="exam-interface" style={{ maxWidth: 600, margin: "auto" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <strong>{exam.title}</strong>
        <span className="badge bg-warning text-dark">
          Time left: {min}:{sec.toString().padStart(2, '0')}
        </span>
      </div>
      <div className="progress mb-2">
        <div className="progress-bar" style={{ width: `${((current+1)/questions.length)*100}%` }}>
          Q{current + 1}/{questions.length}
        </div>
      </div>
      <div className="card mb-3">
        <div className="card-body">
          <div><strong>Q{current + 1}:</strong> {q.question_text}</div>
          <div className="mt-2">
            {JSON.parse(q.options).map((opt, idx) => (
              <div key={idx} className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id={`q${q.id}-opt${idx}`}
                  name={`q${q.id}`}
                  checked={progress[q.id] === idx}
                  onChange={() => handleOption(q.id, idx)}
                />
                <label className="form-check-label" htmlFor={`q${q.id}-opt${idx}`}>
                  {opt}
                </label>
              </div>
            ))}
          </div>
          <button className="btn btn-sm btn-outline-secondary mt-2" onClick={() => handleMark(q.id)}>
            {marked.includes(q.id) ? "Unmark Review" : "Mark for Review"}
          </button>
        </div>
      </div>
      <div className="d-flex justify-content-between">
        <button className="btn btn-secondary" disabled={current === 0} onClick={() => setCurrent(c => c - 1)}>Previous</button>
        <button className="btn btn-primary" disabled={current === questions.length - 1} onClick={() => setCurrent(c => c + 1)}>Next</button>
        <button className="btn btn-danger" onClick={handleSubmit} disabled={submitting}>Submit</button>
      </div>
      <div className="mt-3">
        <strong>Review Marked Questions:</strong> {marked.map(qid => `Q${questions.findIndex(q => q.id === qid) + 1}`).join(', ')}
      </div>
    </div>
  );
}
