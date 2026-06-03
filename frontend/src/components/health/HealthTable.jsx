import { Card, Typography, Box, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import axios from 'axios'

const HealthTable = ({ records, onRecordDeleted }) => {

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await axios.delete(`/api/health/${id}`)
        if (onRecordDeleted) onRecordDeleted()
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
    </Card>
  )
}

export default HealthTable
