import { Box } from '@mui/material'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, ml: '260px' }}>
        <Topbar />
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default MainLayout
