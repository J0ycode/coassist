import axios from 'axios'
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Typography
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

function HealthTable({ records, onDelete }) {
  const handleDelete = async (id) => {
    try {
      await axios.delete('/api/health/' + id)
      onDelete()
    } catch (err) {
      console.error(err)
    }
  }

  const getBpColor = (sys) => {
    if (sys >= 130) return '#ffebee'
    if (sys >= 120) return '#fff8e1'
    return '#e8f5e9'
  }

  const getBpTextColor = (sys) => {
    if (sys >= 130) return '#c62828'
    if (sys >= 120) return '#f57f17'
    return '#2e7d32'
  }

  if (records.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ mt: 2 }}>
        No health records found.
      </Typography>
    )
  }

  return (
    <TableContainer component={Paper} elevation={2}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#1a237e' }}>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Date</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }}>BP (sys/dia)</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Temp (°F)</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }}>SpO₂ (%)</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Note</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map(r => (
            <TableRow key={r._id}>
              <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
              <TableCell
                sx={{
                  bgcolor: getBpColor(r.bloodPressure.systolic),
                  color: getBpTextColor(r.bloodPressure.systolic),
                  fontWeight: 700
                }}
              >
                {r.bloodPressure.systolic}/{r.bloodPressure.diastolic}
              </TableCell>
              <TableCell>{r.temperature}</TableCell>
              <TableCell>{r.bloodOxygen}</TableCell>
              <TableCell>{r.note || '—'}</TableCell>
              <TableCell>
                <IconButton color="error" onClick={() => handleDelete(r._id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default HealthTable
