import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Box, Card, Typography, TextField, Button,
  IconButton, InputAdornment, Alert, Divider, alpha,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import FavoriteIcon from '@mui/icons-material/Favorite'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'

/* ── floating orb decoration ── */
const Orb = ({ size, top, left, right, bottom, color, opacity = 0.18 }) => (
  <Box sx={{
    position: 'absolute',
    width: size, height: size,
    borderRadius: '50%',
    background: color,
    opacity,
    top, left, right, bottom,
    filter: 'blur(60px)',
    pointerEvents: 'none',
  }} />
)

const LoginPage = () => {
  const { login, register } = useAuth()
  const navigate            = useNavigate()

  const [mode, setMode]           = useState('login')      // 'login' | 'register'
  const [username, setUsername]   = useState('')
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [showConf, setShowConf]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')

  const isLogin = mode === 'login'

  const switchMode = () => {
    setMode(m => m === 'login' ? 'register' : 'login')
    setError('')
    setSuccess('')
    setUsername('')
    setPassword('')
    setConfirm('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!username.trim() || !password) {
      setError('Please fill in all fields')
      return
    }

    if (!isLogin) {
      if (password !== confirm) {
        setError('Passwords do not match')
        return
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
    }

    setLoading(true)
    try {
      if (isLogin) {
        await login(username.trim(), password)
        navigate('/', { replace: true })
      } else {
        await register(username.trim(), password)
        setSuccess('Account created! Redirecting…')
        setTimeout(() => navigate('/', { replace: true }), 800)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #0f0c29 0%, #1a1a4e 50%, #24243e 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* background orbs */}
      <Orb size={500} top={-100} left={-150}  color="#5c6bc0" opacity={0.25} />
      <Orb size={400} bottom={-80} right={-100} color="#ef5350" opacity={0.2}  />
      <Orb size={300} top="40%"   right={100}  color="#42a5f5" opacity={0.15} />

      {/* left panel — branding */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' },
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        px: 8,
        position: 'relative',
        zIndex: 1,
      }}>
        {/* logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 5 }}>
          <Box sx={{
            width: 52, height: 52, borderRadius: '14px',
            background: 'linear-gradient(135deg, #ef5350, #5c6bc0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Typography sx={{ fontSize: 26 }}>💊</Typography>
          </Box>
          <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff' }}>
            VitaLedger
          </Typography>
        </Box>

        <Typography variant="h3" fontWeight="bold" sx={{ color: '#fff', mb: 2, lineHeight: 1.2 }}>
          Your Personal<br />Health & Finance<br />Companion
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', maxWidth: 380, mb: 5 }}>
          Track your vitals, manage your budget, and gain insights — all in one secure place.
        </Typography>

        {/* feature pills */}
        {[
          { icon: <FavoriteIcon sx={{ fontSize: 18 }} />, label: 'Health Vitals Tracking', color: '#ef5350' },
          { icon: <AccountBalanceWalletIcon sx={{ fontSize: 18 }} />, label: 'Finance & Budget Management', color: '#66bb6a' },
          { icon: <LockOutlinedIcon sx={{ fontSize: 18 }} />, label: 'Secure Multi-User Access', color: '#42a5f5' },
        ].map((f, i) => (
          <Box key={i} sx={{
            display: 'flex', alignItems: 'center', gap: 1.5,
            mb: 1.5, p: '10px 18px',
            borderRadius: '30px',
            border: `1px solid ${alpha(f.color, 0.3)}`,
            background: alpha(f.color, 0.1),
            width: 'fit-content',
          }}>
            <Box sx={{ color: f.color }}>{f.icon}</Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>{f.label}</Typography>
          </Box>
        ))}
      </Box>

      {/* right panel — card */}
      <Box sx={{
        display: 'flex',
        flex: { xs: 1, md: '0 0 460px' },
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 4 },
        py: 5,
        position: 'relative',
        zIndex: 1,
      }}>
        <Card sx={{
          width: '100%',
          maxWidth: 420,
          p: { xs: 3, sm: 4 },
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 4,
          boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
        }}>
          {/* card header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{
              width: 56, height: 56, borderRadius: '16px', mx: 'auto', mb: 2,
              background: 'linear-gradient(135deg, #5c6bc0, #42a5f5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <LockOutlinedIcon sx={{ color: '#fff', fontSize: 26 }} />
            </Box>
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff' }}>
              {isLogin ? 'Welcome back' : 'Create account'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
              {isLogin ? 'Sign in to your account' : 'Register a new account'}
            </Typography>
          </Box>

          {/* alerts */}
          {error   && <Alert severity="error"   sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{success}</Alert>}

          {/* form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              id="username"
              label="Username"
              fullWidth
              size="small"
              autoComplete="username"
              value={username}
              onChange={e => { setUsername(e.target.value); setError('') }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={textFieldSx}
            />

            <TextField
              id="password"
              label="Password"
              fullWidth
              size="small"
              type={showPass ? 'text' : 'password'}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPass(p => !p)} sx={{ color: 'rgba(255,255,255,0.4)' }}>
                      {showPass ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ ...textFieldSx, mt: 2 }}
            />

            {!isLogin && (
              <TextField
                id="confirm-password"
                label="Confirm Password"
                fullWidth
                size="small"
                type={showConf ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirm}
                onChange={e => { setConfirm(e.target.value); setError('') }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowConf(p => !p)} sx={{ color: 'rgba(255,255,255,0.4)' }}>
                        {showConf ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ ...textFieldSx, mt: 2 }}
              />
            )}

            <Button
              id="submit-btn"
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 3, py: 1.3, borderRadius: 2,
                background: 'linear-gradient(90deg, #5c6bc0, #42a5f5)',
                fontWeight: 'bold', fontSize: '0.95rem', textTransform: 'none',
                boxShadow: '0 4px 20px rgba(92,107,192,0.4)',
                '&:hover': { background: 'linear-gradient(90deg, #4a57a8, #2196f3)', boxShadow: '0 6px 24px rgba(92,107,192,0.5)' },
                '&:disabled': { opacity: 0.6 },
              }}
            >
              {loading ? (isLogin ? 'Signing in…' : 'Creating account…') : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </Box>

          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

          {/* toggle mode */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </Typography>
            <Button
              id="toggle-mode-btn"
              variant="text"
              onClick={switchMode}
              sx={{ mt: 0.5, color: '#42a5f5', fontWeight: 'bold', textTransform: 'none', '&:hover': { color: '#64b5f6' } }}
            >
              {isLogin ? 'Create one for free →' : '← Back to Sign In'}
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  )
}

/* ── shared glassmorphic TextField styles ── */
const textFieldSx = {
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#42a5f5' },
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
    '&.Mui-focused fieldset': { borderColor: '#42a5f5' },
  },
  '& .MuiOutlinedInput-input': { color: '#fff' },
}

export default LoginPage
