import { AppBar, Toolbar, Typography, IconButton, Avatar, Box } from '@mui/material'
import { useLocation } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import { useAuth } from '../../context/AuthContext'

const Topbar = () => {
  const location    = useLocation()
  const { user }    = useAuth()

  const pageNames = {
    '/':        'Dashboard',
    '/health':  'Health Tracker',
    '/finance': 'Expense Tracker',
  }
  const pageName = pageNames[location.pathname] || 'VitaLedger'

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'U'

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: '1px solid #e0e0e0' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" fontWeight="bold">{pageName}</Typography>
          {user && (
            <Typography variant="caption" color="text.secondary">
              Hello, {user.username} 👋
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton><SearchIcon /></IconButton>
          <IconButton><NotificationsNoneIcon /></IconButton>
          <Avatar sx={{
            bgcolor: 'primary.main', ml: 1,
            width: 36, height: 36,
            fontSize: '0.85rem', fontWeight: 'bold',
            background: 'linear-gradient(135deg, #5c6bc0, #42a5f5)',
          }}>
            {initials}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Topbar
