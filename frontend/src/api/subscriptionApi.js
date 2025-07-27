import axios from 'axios';

export function getPlans(token) {
  return axios.get('/api/subscriptions', {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function createPlan(plan, token) {
  return axios.post('/api/subscriptions', plan, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function updatePlan(id, plan, token) {
  return axios.put(`/api/subscriptions/${id}`, plan, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function deletePlan(id, token) {
  return axios.delete(`/api/subscriptions/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
