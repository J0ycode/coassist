import { useState, useEffect } from 'react'
import axios from 'axios'
import { Typography, Box } from '@mui/material'
import HealthForm from '../components/HealthForm'
import HealthTable from '../components/HealthTable'

function Health() {
  const [records, setRecords] = useState([])

  const fetchRecords = async () => {
    try {
      const res = await axios.get('/api/health')
      setRecords(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Health Tracker
      </Typography>
      <HealthForm onAdd={fetchRecords} />
      <HealthTable records={records} onDelete={fetchRecords} />
    </Box>
  )
}

export default Health
