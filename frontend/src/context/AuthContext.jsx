import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)  // verifying token on load

  // On mount: check if token exists and is valid
  useEffect(() => {
    const token = localStorage.getItem('vl_token')
    if (!token) { setLoading(false); return }

    axios.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUser(res.data.user)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      })
      .catch(() => {
        localStorage.removeItem('vl_token')
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (username, password) => {
    const res = await axios.post('/api/auth/login', { username, password })
    const { token, user: u } = res.data
    localStorage.setItem('vl_token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(u)
    return u
  }

  const register = async (username, password) => {
    const res = await axios.post('/api/auth/register', { username, password })
    const { token, user: u } = res.data
    localStorage.setItem('vl_token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(u)
    return u
  }

  const logout = () => {
    localStorage.removeItem('vl_token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
