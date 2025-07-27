import axios from 'axios'
export function fetchExaminerData() {
  return axios.get('/examiner/data')
}
