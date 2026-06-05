import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import axios from 'axios'
import {
  Box, Card, Typography, TextField, Button,
  IconButton, InputAdornment, Alert, Divider, alpha, CircularProgress,
} from '@mui/material'
import VisibilityIcon        from '@mui/icons-material/Visibility'
import VisibilityOffIcon     from '@mui/icons-material/VisibilityOff'
import LockOutlinedIcon      from '@mui/icons-material/LockOutlined'
import PersonOutlineIcon     from '@mui/icons-material/PersonOutline'
import FavoriteIcon          from '@mui/icons-material/Favorite'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'

/* ── floating orb ── */
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

const RegisterPage = () => {
  const navigate = useNavigate()

  const [username,    setUsername]    = useState('')
  const [password,    setPassword]    = useState('')
  const [confirm,     setConfirm]     = useState('')
  const [showPass,    setShowPass]    = useState(false)
  const [showConf,    setShowConf]    = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const [success,     setSuccess]     = useState('')

  /* ── client-side validation ── */
  const validate = () => {
    if (!username.trim())             return 'Username is required'
    if (username.trim().length < 3)   return 'Username must be at least 3 characters'
    if (!password)                    return 'Password is required'
    if (password.length < 6)          return 'Password must be at least 6 characters'
    if (password !== confirm)         return 'Passwords do not match'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setLoading(true)
    try {
      await axios.post('/api/auth/register', {
        username: username.trim().toLowerCase(),
        password,
      })
      setSuccess('Account created! Redirecting to login…')
      setTimeout(() => navigate('/login', { replace: true }), 1500)
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
      <Orb size={500} top={-100}  left={-150}  color="#5c6bc0" opacity={0.25} />
      <Orb size={400} bottom={-80} right={-100} color="#42a5f5" opacity={0.2}  />
      <Orb size={300} top="40%"   right={100}  color="#ef5350" opacity={0.15} />

      {/* ── left branding panel (hidden on mobile) ── */}
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
          Your Personal<br />Health &amp; Finance<br />Companion
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', maxWidth: 380, mb: 5 }}>
          Join thousands of users tracking their vitals, managing their budget, and gaining valuable insights.
        </Typography>

        {/* feature pills */}
        {[
          { icon: <FavoriteIcon sx={{ fontSize: 18 }} />,              label: 'Health Vitals Tracking',    color: '#ef5350' },
          { icon: <AccountBalanceWalletIcon sx={{ fontSize: 18 }} />,  label: 'Finance & Budget Management', color: '#66bb6a' },
          { icon: <LockOutlinedIcon sx={{ fontSize: 18 }} />,          label: 'Secure Multi-User Access',  color: '#42a5f5' },
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

      {/* ── right card panel ── */}
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
          {/* header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{
              width: 56, height: 56, borderRadius: '16px', mx: 'auto', mb: 2,
              background: 'linear-gradient(135deg, #5c6bc0, #42a5f5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Typography sx={{ fontSize: 26 }}>💊</Typography>
            </Box>
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff' }}>
              Create account
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
              Register a new account
            </Typography>
          </Box>

          {/* alerts */}
          {error   && <Alert severity="error"   sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{success}</Alert>}

          {/* form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <TextField
              id="register-username"
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

            {/* Password */}
            <TextField
              id="register-password"
              label="Password"
              fullWidth
              size="small"
              type={showPass ? 'text' : 'password'}
              autoComplete="new-password"
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

            {/* Confirm Password */}
            <TextField
              id="register-confirm-password"
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

            <Button
              id="register-submit-btn"
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
              {loading
                ? <><CircularProgress size={18} sx={{ color: '#fff', mr: 1 }} />Creating account…</>
                : 'Create Account'}
            </Button>
          </Box>

          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Already have an account?
            </Typography>
            <Button
              id="go-to-login-btn"
              component={RouterLink}
              to="/login"
              variant="text"
              sx={{ mt: 0.5, color: '#42a5f5', fontWeight: 'bold', textTransform: 'none', '&:hover': { color: '#64b5f6' } }}
            >
              ← Back to Sign In
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

export default RegisterPage
