import { useState } from 'react'
import { Card, Typography, Divider, Grid, TextField, Button, Box, Snackbar, Alert, Select, MenuItem, InputLabel, FormControl } from '@mui/material'
import axios from 'axios'

const FinanceForm = ({ onTransactionAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const incomeCategories = ['Salary', 'Freelance', 'Business', 'Investment', 'Other']
  const expenseCategories = ['Food', 'Medical', 'Transport', 'Shopping', 'Entertainment', 'Utilities', 'Other']
  const categories = formData.type === 'income' ? incomeCategories : expenseCategories

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleTypeChange = (e) => {
    setFormData({ ...formData, type: e.target.value, category: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/finance', formData)
      setSnackbar({ open: true, message: 'Transaction saved successfully!', severity: 'success' })
      setFormData({
        type: 'expense',
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      })
      if (onTransactionAdded) onTransactionAdded()
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Error saving transaction', severity: 'error' })
    }
  }

  return (
    <Card sx={{ p: 2.5, mb: 3 }}>
      <Typography variant="h6" fontWeight="bold" mb={1}>
        Add Transaction
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small" required>
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
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                label="Category"
                onChange={handleChange}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Amount"
              name="amount"
              type="number"
              size="small"
              fullWidth
              required
              value={formData.amount}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date"
              name="date"
              type="date"
              size="small"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              size="small"
              fullWidth
              required
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Button type="submit" variant="contained" color="primary">
                Save
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

export default FinanceForm
