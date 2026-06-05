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
          onRecordAdded={(newRecord) => {
            // Normalize nested bloodPressure to flat fields to match GET response shape
            const normalized = {
              ...newRecord,
              systolic: newRecord.bloodPressure?.systolic ?? newRecord.systolic,
              diastolic: newRecord.bloodPressure?.diastolic ?? newRecord.diastolic,
            }
            setRecords(prev => [normalized, ...prev])
            setShowForm(false)
          }} 
          onCancel={() => setShowForm(false)} 
        />
      </Collapse>

      <HealthTable 
        records={records} 
        onRecordDeleted={(id) => setRecords(prev => prev.filter(r => r._id !== id))} 
        onRecordUpdated={fetchRecords} 
      />
    </Box>
  )
}

export default Health