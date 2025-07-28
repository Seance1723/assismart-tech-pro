import React, { useEffect, useState } from "react";
import useAuth from '../../auth/useAuth';
import { Link } from "react-router-dom";
import axios from "axios";

export default function ExaminerDashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      setError('');
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/examiner-dashboard/summary", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSummary(res.data);
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
  if (!summary) return <div>Loading...</div>;

  const { subscription, total_candidates, exams } = summary;

  return (
    <div className="container py-4">
      <h2>Examiner Dashboard</h2>

      <Link className="btn btn-primary mb-3" to="/examiner/subscription">
        View/Upgrade Subscription
      </Link>

      <div className="mb-3">
        <strong>Candidate quota:</strong> {user.max_candidates || 'N/A'}<br />
        <strong>Exam quota:</strong> {user.max_exams || 'N/A'}<br />
        <strong>Storage quota:</strong> {user.max_storage_mb || 'N/A'} MB
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Subscription</h5>
              {subscription ? (
                <>
                  <strong>{subscription.plan_name}</strong><br />
                  Expires: {subscription.end_date}<br />
                  Status: {subscription.active ? "Active" : "Inactive"}
                </>
              ) : (
                <span className="text-danger">No active subscription</span>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Candidates</h5>
              <p className="display-5">{total_candidates}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Assigned Exams</h5>
              <p className="display-5">{exams.length}</p>
            </div>
          </div>
        </div>
      </div>

      <h5 className="mt-4">Exam Assignments</h5>
      <table className="table">
        <thead>
          <tr>
            <th>Exam</th>
            <th>Assigned to Candidates</th>
          </tr>
        </thead>
        <tbody>
          {exams.map(e => (
            <tr key={e.id}>
              <td>{e.title}</td>
              <td>{e.assigned_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
