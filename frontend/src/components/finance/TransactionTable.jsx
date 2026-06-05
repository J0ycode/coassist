import { useState } from 'react'
import { Card, Typography, Box, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import axios from 'axios'

const TransactionTable = ({ transactions, onTransactionDeleted, onTransactionUpdated }) => {
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState(false)
  const [editTx, setEditTx] = useState(null)
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: ''
  })

  const incomeCategories = ['Salary', 'Freelance', 'Business', 'Investment', 'Other']
  const expenseCategories = ['Food', 'Medical', 'Transport', 'Shopping', 'Entertainment', 'Utilities', 'Other']
  const categories = formData.type === 'income' ? incomeCategories : expenseCategories

  const handleOpenEdit = (tx) => {
    setEditTx(tx)
    setFormData({
      type: tx.type || 'expense',
      category: tx.category || '',
      amount: tx.amount || '',
      description: tx.description || '',
      date: tx.date ? new Date(tx.date).toISOString().split('T')[0] : ''
    })
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditTx(null)
  }

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleTypeChange = (e) => {
    setFormData({ ...formData, type: e.target.value, category: '' })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`/api/finance/${editTx._id}`, formData)
      handleClose()
      if (onTransactionUpdated) onTransactionUpdated()
    } catch (error) {
      console.error('Error updating transaction', error)
      alert(error.response?.data?.message || 'Error updating transaction')
    }
  }

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
    if (filter === 'all') return true
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
            color={filter === 'all' ? 'primary' : 'default'} 
            onClick={() => setFilter('all')} 
            clickable 
            size="small" 
          />
          <Chip 
            label="Income" 
            color={filter === 'income' ? 'success' : 'default'} 
            onClick={() => setFilter('income')} 
            clickable 
            size="small" 
          />
          <Chip 
            label="Expense" 
            color={filter === 'expense' ? 'error' : 'default'} 
            onClick={() => setFilter('expense')} 
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
                const isIncome = row.type === 'income'
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
        <DialogTitle sx={{ fontWeight: 'bold' }}>Edit Transaction</DialogTitle>
        <form onSubmit={handleUpdate}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    label="Type"
                    onChange={handleTypeChange}
                  >
                    <MenuItem value="income">Income</MenuItem>
                    <MenuItem value="expense">Expense</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    label="Category"
                    onChange={handleFormChange}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Amount"
                  name="amount"
                  type="number"
                  fullWidth
                  required
                  value={formData.amount}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Date"
                  name="date"
                  type="date"
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  value={formData.date}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  fullWidth
                  required
                  value={formData.description}
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

export default TransactionTable
