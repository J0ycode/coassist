import { useState } from 'react'
import { Card, Typography, Box, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import axios from 'axios'

const HealthTable = ({ records, onRecordDeleted, onRecordUpdated }) => {

  const [open, setOpen] = useState(false)
  const [editRecord, setEditRecord] = useState(null)
  const [formData, setFormData] = useState({
    systolic: '',
    diastolic: '',
    temperature: '',
    bloodOxygen: '',
    note: ''
  })

  const handleOpenEdit = (record) => {
    setEditRecord(record)
    setFormData({
      systolic: record.systolic ?? record.bloodPressure?.systolic ?? '',
      diastolic: record.diastolic ?? record.bloodPressure?.diastolic ?? '',
      temperature: record.temperature ?? '',
      bloodOxygen: record.bloodOxygen ?? '',
      note: record.note ?? ''
    })
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditRecord(null)
  }

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`/api/health/${editRecord._id}`, formData)
      handleClose()
      if (onRecordUpdated) onRecordUpdated()
    } catch (error) {
      console.error('Error updating record', error)
      alert(error.response?.data?.message || 'Error updating record')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await axios.delete(`/api/health/${id}`)
        if (onRecordDeleted) onRecordDeleted(id)
      } catch (error) {
        console.error('Error deleting record', error)
      }
    }
  }

  const getBpColor = (status) => {
    if (status === 'Normal') return 'success'
    if (status === 'Elevated') return 'warning'
    return 'error'
  }

  return (
    <Card sx={{ overflow: 'hidden' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Health Records
        </Typography>
        <Chip label={records.length} size="small" color="primary" sx={{ borderRadius: 1 }} />
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Blood Pressure</TableCell>
              <TableCell>Temp (°C)</TableCell>
              <TableCell>SpO2 (%)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Note</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">No records yet</Typography>
                </TableCell>
              </TableRow>
            ) : (
              records.map((row, index) => {
                const date = new Date(row.date)
                const formattedDate = `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
                
                return (
                  <TableRow key={row._id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{formattedDate}</TableCell>
                    <TableCell>{row.systolic}/{row.diastolic}</TableCell>
                    <TableCell>{row.temperature}</TableCell>
                    <TableCell>{row.bloodOxygen}</TableCell>
                    <TableCell>
                      <Chip label={row.bpStatus} color={getBpColor(row.bpStatus)} size="small" />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {row.note || '-'}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleOpenEdit(row)} sx={{ mr: 1 }}>
                        <EditOutlinedIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(row._id)}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 'bold' }}>Edit Health Record</DialogTitle>
        <form onSubmit={handleUpdate}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={6}>
                <TextField
                  label="Systolic BP"
                  name="systolic"
                  type="number"
                  fullWidth
                  required
                  value={formData.systolic}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Diastolic BP"
                  name="diastolic"
                  type="number"
                  fullWidth
                  required
                  value={formData.diastolic}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Temperature (°C)"
                  name="temperature"
                  type="number"
                  inputProps={{ step: "0.1" }}
                  fullWidth
                  required
                  value={formData.temperature}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Blood Oxygen (SpO2 %)"
                  name="bloodOxygen"
                  type="number"
                  fullWidth
                  required
                  value={formData.bloodOxygen}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Note"
                  name="note"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.note}
                  onChange={handleFormChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={handleClose} variant="outlined" color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  )
}

export default HealthTable
