import { useState } from 'react'
import { Card, Typography, Divider, Grid, TextField, Button, Box, Snackbar, Alert } from '@mui/material'
import axios from 'axios'

const HealthForm = ({ onRecordAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    systolic: '',
    diastolic: '',
    temperature: '',
    bloodOxygen: '',
    note: ''
  })
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/api/health', formData)
      setSnackbar({ open: true, message: 'Record saved successfully!', severity: 'success' })
      setFormData({ systolic: '', diastolic: '', temperature: '', bloodOxygen: '', note: '' })
      if (onRecordAdded) onRecordAdded(res.data)
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Error saving record', severity: 'error' })
    }
  }

  return (
    <Card sx={{ p: 2.5, mb: 3 }}>
      <Typography variant="h6" fontWeight="bold" mb={1}>
        Add Health Record
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Systolic BP"
              name="systolic"
              type="number"
              size="small"
              fullWidth
              required
              value={formData.systolic}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Diastolic BP"
              name="diastolic"
              type="number"
              size="small"
              fullWidth
              required
              value={formData.diastolic}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Temperature (°C)"
              name="temperature"
              type="number"
              inputProps={{ step: "0.1" }}
              size="small"
              fullWidth
              required
              value={formData.temperature}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Blood Oxygen (SpO2 %)"
              name="bloodOxygen"
              type="number"
              size="small"
              fullWidth
              required
              value={formData.bloodOxygen}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Note (Optional)"
              name="note"
              size="small"
              fullWidth
              multiline
              rows={2}
              value={formData.note}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Button type="submit" variant="contained" color="primary">
                Save Record
              </Button>
              <Button variant="outlined" onClick={onCancel}>
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  )
}

export default HealthForm
