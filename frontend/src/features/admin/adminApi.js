import axios from 'axios'
export function fetchAdminData() {
  return axios.get('/admin/data')
}
