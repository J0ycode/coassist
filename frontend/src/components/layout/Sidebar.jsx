import {
  Box, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Avatar, IconButton, Tooltip, Divider,
} from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import DashboardIcon from '@mui/icons-material/Dashboard'
import FavoriteIcon from '@mui/icons-material/Favorite'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAuth } from '../../context/AuthContext'

const Sidebar = () => {
  const location      = useLocation()
  const navigate      = useNavigate()
  const { user, logout } = useAuth()

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Health',    icon: <FavoriteIcon />,  path: '/health' },
    { text: 'Finance',   icon: <AccountBalanceWalletIcon />, path: '/finance' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  // Generate avatar initials
  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'U'

  return (
    <Box sx={{
      width: 260,
      height: '100vh',
      position: 'fixed',
      top: 0, left: 0,
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e0e0e0',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Logo */}
      <Box sx={{ pt: 2.5, pb: 2, px: 3 }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          💊 VitaLedger
        </Typography>
      </Box>

      <Divider />

      {/* Nav Items */}
      <List sx={{ px: 2, flexGrow: 1, pt: 1.5 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path
          return (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2, mb: 1,
                backgroundColor: active ? 'rgba(92, 107, 192, 0.08)' : 'transparent',
                color: active ? 'primary.main' : 'text.primary',
                '&:hover': {
                  backgroundColor: active ? 'rgba(92, 107, 192, 0.12)' : 'rgba(0,0,0,0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ color: active ? 'primary.main' : 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontWeight: active ? 'bold' : 'medium' }}
              />
            </ListItemButton>
          )
        })}
      </List>

      {/* User section at bottom */}
      <Divider />
      <Box sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
      }}>
        <Avatar sx={{
          width: 36, height: 36,
          background: 'linear-gradient(135deg, #5c6bc0, #42a5f5)',
          fontSize: '0.85rem', fontWeight: 'bold',
        }}>
          {initials}
        </Avatar>
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <Typography variant="body2" fontWeight="bold" noWrap>
            {user?.username || 'User'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Signed in
          </Typography>
        </Box>
        <Tooltip title="Sign out">
          <IconButton
            size="small"
            onClick={handleLogout}
            sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
          >
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}

export default Sidebar
