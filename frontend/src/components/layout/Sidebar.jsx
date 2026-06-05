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
import logo from '../../logo.png'

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
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Logo */}
      <Box sx={{ pt: 2, pb: 1.5, px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box component="img" src={logo} sx={{ width: 32, height: 32, borderRadius: '8px', objectFit: 'cover' }} />
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold', letterSpacing: '0.5px' }}>
            Coassist
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

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
                backgroundColor: active ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: active ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  backgroundColor: active ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ color: active ? '#42a5f5' : 'rgba(255, 255, 255, 0.6)', minWidth: 40 }}>
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
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />
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
          <Typography variant="body2" fontWeight="bold" sx={{ color: '#fff' }} noWrap>
            {user?.username || 'User'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            Signed in
          </Typography>
        </Box>
        <Tooltip title="Sign out">
          <IconButton
            size="small"
            onClick={handleLogout}
            sx={{ color: 'rgba(255, 255, 255, 0.6)', '&:hover': { color: 'error.main' } }}
          >
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}

export default Sidebar
