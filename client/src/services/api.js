import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})


api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url = error.config?.url || ''
    const isAuthCheck = !url.includes('/users/password') && !url.includes('/users/profile')

    if (error.response?.status === 401 && isAuthCheck) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api