import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  return (
    <AppBar position="static" sx={{ bgcolor: '#1a237e' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
          VitaLedger
        </Typography>
        <Box>
          <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
          <Button color="inherit" onClick={() => navigate('/health')}>Health</Button>
          <Button color="inherit" onClick={() => navigate('/finance')}>Finance</Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
