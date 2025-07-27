import axios from 'axios'
const API = '/auth'

export function login({ email, password }) {
  return axios.post(`${API}/login`, { email, password })
}

export function register({ email, password }) {
  return axios.post(`${API}/register`, { email, password })
}
