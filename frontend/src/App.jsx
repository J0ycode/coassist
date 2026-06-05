import { ThemeProvider, CssBaseline } from '@mui/material'
import { Routes, Route, Navigate } from 'react-router-dom'
import theme from './theme/theme'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import MainLayout from './components/layout/MainLayout'
import Home from './pages/Home'
import Health from './pages/Health'
import Finance from './pages/Finance'
import LoginPage    from './pages/Login'
import RegisterPage from './pages/Register'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected — wrapped in MainLayout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout><Home /></MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/health"
            element={
              <ProtectedRoute>
                <MainLayout><Health /></MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/finance"
            element={
              <ProtectedRoute>
                <MainLayout><Finance /></MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
