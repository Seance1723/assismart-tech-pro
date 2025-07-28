import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SubscriptionAndBilling() {
  const [subscription, setSubscription] = useState(null);
  const [history, setHistory] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      const token = localStorage.getItem("token");
      const [sub, hist, inv] = await Promise.all([
        axios.get("/api/examiner-subscription/current", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/api/examiner-subscription/history", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/api/examiner-subscription/invoices", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setSubscription(sub.data);
      setHistory(hist.data);
      setInvoices(inv.data);
      setLoading(false);
    }
    fetchAll();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Subscription & Billing</h2>
      <div className="card mb-4">
        <div className="card-header">Current Subscription</div>
        <div className="card-body">
          {subscription?.plan_name ? (
            <>
              <strong>Plan:</strong> {subscription.plan_name} <br />
              <strong>Status:</strong> {subscription.active ? "Active" : "Inactive"}<br />
              <strong>Start:</strong> {subscription.start_date} <br />
              <strong>End:</strong> {subscription.end_date} <br />
              <strong>Price:</strong> ₹{subscription.price} / {subscription.duration_months} month(s)
            </>
          ) : (
            <span>No active subscription. <button className="btn btn-link">Upgrade</button></span>
          )}
        </div>
      </div>
      <div className="mb-4">
        <h5>Billing History</h5>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th><th>Amount</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i}>
                <td>{new Date(h.paid_at).toLocaleDateString()}</td>
                <td>₹{h.amount}</td>
                <td>{h.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h5>Invoices</h5>
        <table className="table">
          <thead>
            <tr>
              <th>Invoice #</th><th>Amount</th><th>Issued</th><th>Download</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, i) => (
              <tr key={i}>
                <td>{inv.invoice_number}</td>
                <td>₹{inv.amount}</td>
                <td>{new Date(inv.issued_at).toLocaleDateString()}</td>
                <td>
                  {inv.file_url
                    ? <a href={inv.file_url} target="_blank" rel="noopener noreferrer" download>Download</a>
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
