import { Box } from '@mui/material'
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

const MainLayout = ({ children }) => {
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

      <Sidebar />
      <Box sx={{ flexGrow: 1, ml: '260px', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        <Box sx={{ p: 3, flexGrow: 1, position: 'relative', zIndex: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default MainLayout
