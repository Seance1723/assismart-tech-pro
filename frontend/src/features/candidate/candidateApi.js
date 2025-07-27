import axios from 'axios'
export function fetchCandidateData() {
  return axios.get('/candidate/data')
}
