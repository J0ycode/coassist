import { useState } from 'react'
import axios from 'axios'
import {
  Box, TextField, Button, Alert, Typography, Grid, Paper,
  Select, MenuItem, InputLabel, FormControl
} from '@mui/material'

const incomeCategories = ['Salary', 'Freelance', 'Business', 'Other']
const expenseCategories = ['Food', 'Medical', 'Transport', 'Shopping', 'Entertainment', 'Utilities', 'Other']

function FinanceForm({ onAdd }) {
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [success, setSuccess] = useState(false)

  const categories = type === 'income' ? incomeCategories : expenseCategories

  const handleTypeChange = (e) => {
    setType(e.target.value)
    setCategory('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/finance', {
        type,
        category,
        amount: Number(amount),
        description
      })
      setType('expense')
      setCategory('')
      setAmount('')
      setDescription('')
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
        Add Transaction
      </Typography>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Transaction added successfully!
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Type</InputLabel>
              <Select value={type} label="Type" onChange={handleTypeChange}>
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select value={category} label="Category" onChange={e => setCategory(e.target.value)}>
                {categories.map(c => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Amount"
              type="number"
              fullWidth
              required
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Description (optional)"
              fullWidth
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#1a237e' }}>
              Add Transaction
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}

export default FinanceForm
