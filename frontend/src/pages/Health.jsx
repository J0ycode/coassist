import { useState, useEffect } from 'react'
import { Box, Button, Collapse } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import axios from 'axios'
import HealthForm from '../components/health/HealthForm'
import HealthTable from '../components/health/HealthTable'

const Health = () => {
  const [showForm, setShowForm] = useState(false)
  const [records, setRecords] = useState([])

  const fetchRecords = async () => {
    try {
      const res = await axios.get('/api/health')
      setRecords(res.data)
    } catch (error) {
      console.error('Error fetching health records:', error)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => setShowForm(!showForm)}
        >
          Add Record
        </Button>
      </Box>

      <Collapse in={showForm}>
        <HealthForm 
          onRecordAdded={() => {
            fetchRecords()
            setShowForm(false)
          }} 
          onCancel={() => setShowForm(false)} 
        />
      </Collapse>

      <HealthTable records={records} onRecordDeleted={fetchRecords} />
    </Box>
  )
}

export default Health
