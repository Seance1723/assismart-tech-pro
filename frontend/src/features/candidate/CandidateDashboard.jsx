import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CandidateDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    async function fetchData() {
      setError('');
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/candidate-dashboard/summary", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        setError(
          err.response?.data?.error === "Unauthorized"
            ? "Session expired. Please login again."
            : err.response?.data?.error || "Failed to load dashboard."
        );
      }
    }
    fetchData();
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h2>Candidate Dashboard</h2>
      <h5>Upcoming & Available Exams</h5>
      <table className="table">
        <thead>
          <tr>
            <th>Exam</th>
            <th>Schedule</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.exams.map(e => (
            <tr key={e.id}>
              <td>{e.title}</td>
              <td>
                {e.start_time ? `${new Date(e.start_time).toLocaleString()} - ${new Date(e.end_time).toLocaleString()}` : "N/A"}
              </td>
              <td>{e.status}</td>
              <td>
                {/* You can conditionally enable "Start Exam" button based on time/status */}
                <a href={`/candidate/exam/${e.id}`} className="btn btn-primary btn-sm">Start/Resume</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h5 className="mt-4">Past Exam History</h5>
      <table className="table">
        <thead>
          <tr>
            <th>Exam</th>
            <th>Score</th>
            <th>Status</th>
            <th>Attempts</th>
            <th>Date</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {data.history.map(h => (
            <tr key={`${h.exam_id}-${h.attempt}`}>
              <td>{h.title}</td>
              <td>{h.score}</td>
              <td>{h.passed ? "Passed" : "Failed"}</td>
              <td>{h.attempt}</td>
              <td>{new Date(h.submitted_at).toLocaleString()}</td>
              <td>
                <a href={`/candidate/results/${h.exam_id}/${h.attempt}`} className="btn btn-sm btn-info">View</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
