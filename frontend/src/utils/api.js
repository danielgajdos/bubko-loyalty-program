import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://perceptive-radiance-production.up.railway.app/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  const adminToken = localStorage.getItem('adminToken')
  
  if (token && !config.url.includes('/admin/')) {
    config.headers.Authorization = `Bearer ${token}`
  } else if (adminToken && config.url.includes('/admin/')) {
    config.headers.Authorization = `Bearer ${adminToken}`
  }
  
  return config
})

export default {
  // Auth endpoints
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  adminLogin: (credentials) => api.post('/auth/admin/login', credentials),
  
  // User endpoints
  getProfile: () => api.get('/users/profile'),
  getVisits: () => api.get('/users/visits'),
  
  // Admin endpoints
  scanQR: (qrCode) => api.post('/admin/scan', { qrCode }),
  confirmFreeVisit: (qrCode, useFreeVisit) => api.post('/admin/scan/free', { qrCode, useFreeVisit }),
  getDashboard: () => api.get('/admin/dashboard'),
  
  // Admin user management endpoints
  getAllUsers: () => api.get('/admin/users'),
  updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
  assignQRCode: (userId, qrCode) => api.put(`/admin/users/${userId}/qr-code`, { qrCode }),
  quickRegister: (userData) => api.post('/admin/quick-register', userData),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`)
}