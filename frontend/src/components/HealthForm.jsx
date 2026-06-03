import { useState } from 'react'
import axios from 'axios'
import {
  Box, TextField, Button, Alert, Typography, Grid, Paper
} from '@mui/material'

function HealthForm({ onAdd }) {
  const [systolic, setSystolic] = useState('')
  const [diastolic, setDiastolic] = useState('')
  const [temperature, setTemperature] = useState('')
  const [bloodOxygen, setBloodOxygen] = useState('')
  const [note, setNote] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/health', {
        systolic: Number(systolic),
        diastolic: Number(diastolic),
        temperature: Number(temperature),
        bloodOxygen: Number(bloodOxygen),
        note
      })
      setSystolic('')
      setDiastolic('')
      setTemperature('')
      setBloodOxygen('')
      setNote('')
      setSuccess(true)
      onAdd()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Add Health Record
      </Typography>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Health record added successfully!
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Systolic BP (mmHg)"
              type="number"
              fullWidth
              required
              value={systolic}
              onChange={e => setSystolic(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Diastolic BP (mmHg)"
              type="number"
              fullWidth
              required
              value={diastolic}
              onChange={e => setDiastolic(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Temperature (°F)"
              type="number"
              fullWidth
              required
              value={temperature}
              onChange={e => setTemperature(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Blood Oxygen (%)"
              type="number"
              fullWidth
              required
              value={bloodOxygen}
              onChange={e => setBloodOxygen(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Note (optional)"
              fullWidth
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#1a237e' }}>
              Add Record
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}

export default HealthForm
