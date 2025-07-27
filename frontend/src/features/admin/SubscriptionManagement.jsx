import React, { useEffect, useState } from 'react';
import useAuth from '../../auth/useAuth';
import { getPlans, createPlan, updatePlan, deletePlan } from '../../api/subscriptionApi';

export default function SubscriptionManagement() {
  const { token } = useAuth();
  const [plans, setPlans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    max_examiners: '',
    max_candidates: '',
    max_exams: '',
    max_storage_mb: '',
    features: ''
  });

  useEffect(() => {
    fetchPlans();
    // eslint-disable-next-line
  }, []);

  async function fetchPlans() {
    const res = await getPlans(token);
    setPlans(res.data);
  }

  function openAddForm() {
    setEditingPlan(null);
    setForm({
      name: '',
      price: '',
      max_examiners: '',
      max_candidates: '',
      max_exams: '',
      max_storage_mb: '',
      features: ''
    });
    setShowForm(true);
  }

  function openEditForm(plan) {
    setEditingPlan(plan);
    setForm(plan);
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (window.confirm("Delete this plan?")) {
      await deletePlan(id, token);
      fetchPlans();
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editingPlan) {
      await updatePlan(editingPlan.id, form, token);
    } else {
      await createPlan(form, token);
    }
    setShowForm(false);
    fetchPlans();
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Subscription Management</h2>

      <button className="btn btn-primary mb-3" onClick={openAddForm}>
        Add Plan
      </button>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Name</th><th>Price</th>
            <th>Examiners</th><th>Candidates</th>
            <th>Exams</th><th>Storage (MB)</th>
            <th>Features</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.map(plan => (
            <tr key={plan.id}>
              <td>{plan.name}</td>
              <td>{plan.price}</td>
              <td>{plan.max_examiners}</td>
              <td>{plan.max_candidates}</td>
              <td>{plan.max_exams}</td>
              <td>{plan.max_storage_mb}</td>
              <td>{plan.features}</td>
              <td>
                <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => openEditForm(plan)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(plan.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <form onSubmit={handleSubmit} className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingPlan ? "Edit" : "Add"} Subscription Plan</h5>
                <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
              </div>
              <div className="modal-body">
                {["name", "price", "max_examiners", "max_candidates", "max_exams", "max_storage_mb", "features"].map(field => (
                  <div className="mb-2" key={field}>
                    <label className="form-label text-capitalize">{field.replace(/_/g, ' ')}</label>
                    <input
                      type={field === "price" ? "number" : "text"}
                      className="form-control"
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      required={field !== "features"}
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
    </div>
  );
}
