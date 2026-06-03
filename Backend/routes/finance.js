const express = require('express')
const router = express.Router()
const Transaction = require('../models/Transaction')

// POST / — save new transaction
router.post('/', async (req, res) => {
  try {
    const { type, category, amount, description } = req.body
    const transaction = new Transaction({ type, category, amount, description })
    const saved = await transaction.save()
    res.status(201).json(saved)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// GET / — get all transactions sorted by date descending
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 })
    res.json(transactions)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// DELETE /:id — delete a transaction
router.delete('/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id)
    res.json({ message: 'Transaction deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// GET /report — aggregated finance stats
router.get('/report', async (req, res) => {
  try {
    const transactions = await Transaction.find()

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const netBalance = totalIncome - totalExpenses

    const savingsRate = totalIncome > 0
      ? ((netBalance / totalIncome) * 100).toFixed(1) + '%'
      : '0.0%'

    const expenseByCategory = {}
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount
      })

    res.json({
      totalIncome,
      totalExpenses,
      netBalance,
      savingsRate,
      expenseByCategory
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
