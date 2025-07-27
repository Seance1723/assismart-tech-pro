import axios from 'axios';

export function getCandidates(token) {
  return axios.get('/api/candidates', { headers: { Authorization: `Bearer ${token}` } });
}
export function getCandidate(id, token) {
  return axios.get(`/api/candidates/${id}`, { headers: { Authorization: `Bearer ${token}` } });
}
export function createCandidate(candidate, token) {
  return axios.post('/api/candidates', candidate, { headers: { Authorization: `Bearer ${token}` } });
}
export function updateCandidate(id, candidate, token) {
  return axios.put(`/api/candidates/${id}`, candidate, { headers: { Authorization: `Bearer ${token}` } });
}
export function deleteCandidate(id, token) {
  return axios.delete(`/api/candidates/${id}`, { headers: { Authorization: `Bearer ${token}` } });
}
export function bulkImportCandidates(candidates, token) {
  return axios.post('/api/candidates/bulk', { candidates }, { headers: { Authorization: `Bearer ${token}` } });
}
export function bulkUploadCandidatesFile(file, token) {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post('/api/candidates/bulk-upload', formData, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
export function getCandidateProgress(id, token) {
  return axios.get(`/api/candidates/${id}/progress`, { headers: { Authorization: `Bearer ${token}` } });
}
export function getCandidatesAnalytics(token) {
  return axios.get('/api/candidates/analytics', { headers: { Authorization: `Bearer ${token}` } });
}
