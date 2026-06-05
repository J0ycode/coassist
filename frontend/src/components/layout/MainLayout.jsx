import { useState } from 'react'
import { Box, Drawer } from '@mui/material'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

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
    zIndex: 0,
  }} />
)

const drawerWidth = 260

const MainLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #1a1a4e 50%, #24243e 100%)',
      backgroundAttachment: 'fixed',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* background orbs */}
      <Orb size={500} top={-100} left={-150}  color="#5c6bc0" opacity={0.25} />
      <Orb size={400} bottom={-80} right={-100} color="#ef5350" opacity={0.2}  />
      <Orb size={300} top="40%"   right={100}  color="#42a5f5" opacity={0.15} />

      {/* Sidebar for Desktop */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, width: drawerWidth, flexShrink: 0 }}>
        <Sidebar />
      </Box>

      {/* Sidebar Drawer for Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth, 
            border: 'none',
            backgroundColor: 'rgba(15, 12, 41, 0.95)',
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        <Sidebar onClose={handleDrawerToggle} />
      </Drawer>

      <Box sx={{
        flexGrow: 1,
        ml: { xs: 0, md: `${drawerWidth}px` },
        width: { md: `calc(100% - ${drawerWidth}px)` },
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Topbar onDrawerToggle={handleDrawerToggle} />
        <Box sx={{ p: { xs: 2, sm: 3 }, flexGrow: 1, position: 'relative', zIndex: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default MainLayout
