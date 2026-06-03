import axios from 'axios'
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Chip, Typography
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

function TransactionTable({ transactions, onDelete }) {
  const handleDelete = async (id) => {
    try {
      await axios.delete('/api/finance/' + id)
      onDelete()
    } catch (err) {
      console.error(err)
    }
  }

  if (transactions.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ mt: 2 }}>
        No transactions found.
      </Typography>
    )
  }

  return (
    <TableContainer component={Paper} elevation={2}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#1a237e' }}>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Date</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Type</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Category</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Amount</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Description</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map(t => (
            <TableRow key={t._id}>
              <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Chip
                  label={t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                  size="small"
                  sx={{
                    bgcolor: t.type === 'income' ? '#e8f5e9' : '#ffebee',
                    color: t.type === 'income' ? '#2e7d32' : '#c62828',
                    fontWeight: 700
                  }}
                />
              </TableCell>
              <TableCell>{t.category}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>₱{t.amount.toFixed(2)}</TableCell>
              <TableCell>{t.description || '—'}</TableCell>
              <TableCell>
                <IconButton color="error" onClick={() => handleDelete(t._id)}>
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

export default TransactionTable
