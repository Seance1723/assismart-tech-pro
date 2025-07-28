import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ReportsAndAnalytics() {
  const [candidateReport, setCandidateReport] = useState([]);
  const [examReport, setExamReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [cand, exam] = await Promise.all([
        axios.get('/api/examiner-reports/candidates', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/examiner-reports/exams', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setCandidateReport(cand.data);
      setExamReport(exam.data);
      setLoading(false);
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h2>Reports & Analytics</h2>
      <div className="mb-4">
        <h5>Candidate Progression</h5>
        <a href="/api/examiner-reports/candidates/csv" className="btn btn-sm btn-outline-secondary me-2" target="_blank" rel="noopener noreferrer">Download Excel</a>
        <a href="/api/examiner-reports/candidates/pdf" className="btn btn-sm btn-outline-secondary" target="_blank" rel="noopener noreferrer">Download PDF</a>
        <table className="table mt-2">
          <thead>
            <tr>
              <th>Email</th><th>Attempts</th><th>Avg Score</th><th>Total Passed</th>
            </tr>
          </thead>
          <tbody>
            {candidateReport.map(c => (
              <tr key={c.candidate_id}>
                <td>{c.email}</td>
                <td>{c.attempts}</td>
                <td>{c.avg_score ? c.avg_score.toFixed(2) : 0}</td>
                <td>{c.total_passed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h5>Exam Effectiveness</h5>
        <table className="table">
          <thead>
            <tr>
              <th>Exam</th><th>Attempts</th><th>Avg Score</th><th>Total Passed</th>
            </tr>
          </thead>
          <tbody>
            {examReport.map(e => (
              <tr key={e.exam_id}>
                <td>{e.title}</td>
                <td>{e.attempts}</td>
                <td>{e.avg_score ? e.avg_score.toFixed(2) : 0}</td>
                <td>{e.total_passed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
