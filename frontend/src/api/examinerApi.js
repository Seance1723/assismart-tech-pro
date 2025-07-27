import axios from 'axios';

export function getExaminers(token) {
  return axios.get('/api/examiners', { headers: { Authorization: `Bearer ${token}` } });
}

export function createExaminer(examiner, token) {
  return axios.post('/api/examiners', examiner, { headers: { Authorization: `Bearer ${token}` } });
}

export function updateExaminer(id, examiner, token) {
  return axios.put(`/api/examiners/${id}`, examiner, { headers: { Authorization: `Bearer ${token}` } });
}

export function deleteExaminer(id, token) {
  return axios.delete(`/api/examiners/${id}`, { headers: { Authorization: `Bearer ${token}` } });
}

export function getExaminerLog(id, token) {
  return axios.get(`/api/examiners/${id}/activity`, { headers: { Authorization: `Bearer ${token}` } });
}
