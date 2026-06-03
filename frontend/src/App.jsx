import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Health from './pages/Health'
import Finance from './pages/Finance'
import { Container } from '@mui/material'

function App() {
  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/health" element={<Health />} />
          <Route path="/finance" element={<Finance />} />
        </Routes>
      </Container>
    </>
  )
}

export default App
