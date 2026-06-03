import { AppBar, Toolbar, Typography, IconButton, Avatar, Box } from '@mui/material'
import { useLocation } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'

const Topbar = () => {
  const location = useLocation()

  let pageName = 'Dashboard'
  if (location.pathname === '/health') pageName = 'Health Tracker'
  else if (location.pathname === '/finance') pageName = 'Expense Tracker'

  return (
    <AppBar 
      position="sticky" 
      color="inherit" 
      elevation={0}
      sx={{ 
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight="bold">
          {pageName}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <NotificationsNoneIcon />
          </IconButton>
          <Avatar sx={{ bgcolor: 'primary.main', ml: 1, width: 36, height: 36 }}>
            V
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Topbar
