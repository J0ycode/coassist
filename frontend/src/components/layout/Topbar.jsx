import { useState, useEffect } from 'react'
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box, Tooltip } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import { useAuth } from '../../context/AuthContext'

const Topbar = ({ onDrawerToggle }) => {
  const location          = useLocation()
  const navigate          = useNavigate()
  const { user, logout }  = useAuth()

  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formattedTime = time.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const pageNames = {
    '/':        'Dashboard',
    '/health':  'Health Tracker',
    '/finance': 'Expense Tracker',
  }
  const pageName = pageNames[location.pathname] || 'Coassist'

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'U'

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        backgroundColor: '#121030',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 1, display: { md: 'none' }, color: 'rgba(255, 255, 255, 0.7)' }}
          >
            <MenuIcon />
          </IconButton>
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff', lineHeight: 1.2 }}>{pageName}</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', fontSize: '0.75rem' }}>
              {formattedTime}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton sx={{ color: 'rgba(255, 255, 255, 0.7)' }}><SearchIcon /></IconButton>
          <IconButton sx={{ color: 'rgba(255, 255, 255, 0.7)' }}><NotificationsNoneIcon /></IconButton>
          <Avatar sx={{
            bgcolor: 'primary.main', ml: 1,
            width: 36, height: 36,
            fontSize: '0.85rem', fontWeight: 'bold',
            background: 'linear-gradient(135deg, #5c6bc0, #42a5f5)',
          }}>
            {initials}
          </Avatar>
          {user && (
            <Typography variant="body2" sx={{ ml: 0.5, color: 'rgba(255, 255, 255, 0.8)', display: { xs: 'none', sm: 'block' } }}>
              {user.username}
            </Typography>
          )}
          <Tooltip title="Logout">
            <IconButton
              id="logout-btn"
              onClick={handleLogout}
              size="small"
              sx={{ ml: 0.5, color: 'rgba(255, 255, 255, 0.6)', '&:hover': { color: 'error.main' } }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Topbar
