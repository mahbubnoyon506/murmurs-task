import api from './api'

export const authService = {
  // Bonus: Registration
  async register(data: any) {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  // Login to get the access_token
  async login(data: any) {
    const response = await api.post('/auth/login', data)
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}
