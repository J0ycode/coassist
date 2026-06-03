import { useState } from 'react'
import { Card, Typography, Box, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import axios from 'axios'

const TransactionTable = ({ transactions, onTransactionDeleted }) => {
  const [filter, setFilter] = useState('All')

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await axios.delete(`/api/finance/${id}`)
        if (onTransactionDeleted) onTransactionDeleted()
      } catch (error) {
        console.error('Error deleting transaction', error)
      }
    }
  }

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'All') return true
    return t.type === filter
  })

  return (
    <Card sx={{ overflow: 'hidden' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight="bold">
          Transactions
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip 
            label="All" 
            color={filter === 'All' ? 'primary' : 'default'} 
            onClick={() => setFilter('All')} 
            clickable 
            size="small" 
          />
          <Chip 
            label="Income" 
            color={filter === 'Income' ? 'success' : 'default'} 
            onClick={() => setFilter('Income')} 
            clickable 
            size="small" 
          />
          <Chip 
            label="Expense" 
            color={filter === 'Expense' ? 'error' : 'default'} 
            onClick={() => setFilter('Expense')} 
            clickable 
            size="small" 
          />
        </Box>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">No transactions found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((row, index) => {
                const isIncome = row.type === 'Income'
                return (
                  <TableRow key={row._id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip label={row.type} color={isIncome ? 'success' : 'error'} size="small" />
                    </TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell sx={{ color: isIncome ? 'success.main' : 'error.main', fontWeight: 'medium' }}>
                      {isIncome ? '+' : '-'}₹ {row.amount}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {row.description}
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

export default TransactionTable
