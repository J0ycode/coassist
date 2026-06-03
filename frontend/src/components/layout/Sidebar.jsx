import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import DashboardIcon from '@mui/icons-material/Dashboard'
import FavoriteIcon from '@mui/icons-material/Favorite'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Health', icon: <FavoriteIcon />, path: '/health' },
    { text: 'Finance', icon: <AccountBalanceWalletIcon />, path: '/finance' }
  ]

  return (
    <Box
      sx={{
        width: 260,
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ pt: 2.5, pb: 2, px: 3 }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          💊 VitaLedger
        </Typography>
      </Box>
      <List sx={{ px: 2, flexGrow: 1 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path
          return (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                mb: 1,
                backgroundColor: active ? 'rgba(92, 107, 192, 0.08)' : 'transparent',
                color: active ? 'primary.main' : 'text.primary',
                '&:hover': {
                  backgroundColor: active ? 'rgba(92, 107, 192, 0.12)' : 'rgba(0,0,0,0.04)',
                }
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
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <Typography variant="caption" color="text.secondary">
          VitaLedger v1.0
        </Typography>
      </Box>
    </Box>
  )
}

export default Sidebar
