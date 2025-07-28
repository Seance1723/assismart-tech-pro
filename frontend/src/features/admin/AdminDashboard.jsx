import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      setError('');
      try {
        const token = localStorage.getItem("token");
        const res1 = await axios.get("/api/admin-dashboard/summary", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const res2 = await axios.get("/api/admin-dashboard/analytics", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSummary(res1.data);
        setAnalytics(res2.data);
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
  if (!summary || !analytics) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="mb-4">Admin Dashboard</h2>
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Active Users</h5>
              <p className="card-text display-5">{summary.active_users}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Active Exams</h5>
              <p className="card-text display-5">{summary.active_exams}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Active Subscriptions</h5>
              <p className="card-text display-5">{summary.total_subscriptions}</p>
            </div>
          </div>
        </div>
      </div>
      <h5 className="mt-4">Recent Activities</h5>
      <ul className="list-group mb-5">
        {summary.recent_activities.map((a, i) => (
          <li key={i} className="list-group-item">
            {a.activity} - {new Date(a.created_at).toLocaleString()}
          </li>
        ))}
      </ul>
      <div className="row">
        <div className="col-md-6">
          <h5>User Registrations (last 6 months)</h5>
          <ul>
            {analytics.userRegistrations.map((u) => (
              <li key={u.month}>{u.month}: {u.count}</li>
            ))}
          </ul>
        </div>
        <div className="col-md-6">
          <h5>Subscriptions by Plan</h5>
          <ul>
            {analytics.subscriptionsByPlan.map((s) => (
              <li key={s.name}>{s.name}: {s.count}</li>
            ))}
          </ul>
        </div>
        <div className="col-md-12 mt-4">
          <h5>Exam Pass Rates</h5>
          <ul>
            {analytics.examPerformance.map((e) => (
              <li key={e.title}>{e.title}: {e.pass_rate || 0}% pass</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
