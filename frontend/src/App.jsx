import { ThemeProvider, CssBaseline } from '@mui/material'
import { Routes, Route } from 'react-router-dom'
import theme from './theme/theme'
import MainLayout from './components/layout/MainLayout'
import Home from './pages/Home'
import Health from './pages/Health'
import Finance from './pages/Finance'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/health" element={<Health />} />
          <Route path="/finance" element={<Finance />} />
        </Routes>
      </MainLayout>
    </ThemeProvider>
  )
}

export default App
