import React, { useEffect, useState, useRef } from "react";
import screenfull from "screenfull";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
  const [showNotice, setShowNotice] = useState(true);
  const intervalRef = useRef();

  // ============================
  // Security & Proctoring Logic
  // ============================
  useEffect(() => {
    // 1. Enforce fullscreen on mount
    if (screenfull.isEnabled) screenfull.request();

    // 2. Auto-terminate if fullscreen is exited
    function onFullscreenChange() {
      if (!screenfull.isFullscreen) {
        alert("Full-screen required for exam! Exam will be terminated.");
        handleForceSubmit("Fullscreen exited");
      }
    }
    if (screenfull.isEnabled) {
      screenfull.on("change", onFullscreenChange);
    }

    // 3. Auto-terminate on tab/window blur
    function onBlur() {
      alert("You switched tabs or lost focus. Exam will be terminated.");
      handleForceSubmit("Tab/window focus lost");
    }
    window.addEventListener("blur", onBlur);

    // 4. Block right-click/context menu
    function disableContextMenu(e) {
      e.preventDefault();
    }
    document.addEventListener("contextmenu", disableContextMenu);

    // 5. Block F12/DevTools/Ctrl+U/Ctrl+Shift+I/P/S/C/V/X
    function disableKey(e) {
      // F12
      if (e.keyCode === 123) e.preventDefault();
      // Ctrl+Shift+I/J/C, Ctrl+U/S/P, Ctrl+C/V/X
      if (
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && ["U", "S", "P", "C", "V", "X"].includes(e.key.toUpperCase()))
      ) {
        e.preventDefault();
      }
    }
    document.addEventListener("keydown", disableKey);

    // 6. Block clipboard events
    function blockClipboard(e) { e.preventDefault(); }
    document.addEventListener("copy", blockClipboard);
    document.addEventListener("paste", blockClipboard);
    document.addEventListener("cut", blockClipboard);

    // 7. Block drag/drop
    function blockDragDrop(e) { e.preventDefault(); }
    document.addEventListener("dragstart", blockDragDrop);
    document.addEventListener("drop", blockDragDrop);

    // CLEANUP on unmount
    return () => {
      if (screenfull.isEnabled) screenfull.off("change", onFullscreenChange);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("keydown", disableKey);
      document.removeEventListener("copy", blockClipboard);
      document.removeEventListener("paste", blockClipboard);
      document.removeEventListener("cut", blockClipboard);
      document.removeEventListener("dragstart", blockDragDrop);
      document.removeEventListener("drop", blockDragDrop);
    };
    // eslint-disable-next-line
  }, []);

  // ================
  // Exam Load Logic
  // ================
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
      if (screenfull.isEnabled) setTimeout(() => screenfull.request(), 400);
    }
    fetchExam();
    // eslint-disable-next-line
  }, [exam_id]);

  // Timer
  useEffect(() => {
    if (timer <= 0) {
      handleSubmit();
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

  // For regular/forced submit
  async function handleForceSubmit(reason = "Security policy") {
    // Optionally log reason to backend here
    alert("Exam is being terminated for security reasons: " + reason);
    // Optionally send a forced submit/flag to backend
    try {
      const token = localStorage.getItem("token");
      await axios.post(`/api/candidate-exam/${exam_id}/submit`, {
        answers: progress,
        forced: true,
        reason
      }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {}
    window.location.href = "/candidate";
  }

  async function handleSubmit() {
    if (!window.confirm("Submit exam? You cannot change answers later!")) return;
    setSubmitting(true);
    const token = localStorage.getItem("token");
    await axios.post(`/api/candidate-exam/${exam_id}/submit`, {
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
      {/* Security Warning */}
      {showNotice && (
        <div className="alert alert-warning">
          <strong>Security Notice:</strong> This exam requires full-screen. 
          Leaving, switching tabs, copying, or printing will terminate your exam.
          <button className="btn btn-sm btn-primary ms-3" onClick={() => setShowNotice(false)}>OK, Start Exam</button>
        </div>
      )}

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
