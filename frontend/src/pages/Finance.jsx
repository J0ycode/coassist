import { useState, useEffect } from 'react'
import axios from 'axios'
import { Typography, Box, Tabs, Tab } from '@mui/material'
import FinanceForm from '../components/FinanceForm'
import TransactionTable from '../components/TransactionTable'
import ReportSection from '../components/ReportSection'

function Finance() {
  const [tab, setTab] = useState(0)
  const [transactions, setTransactions] = useState([])

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('/api/finance')
      setTransactions(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Expense Tracker
      </Typography>
      <Tabs value={tab} onChange={(e, val) => setTab(val)} sx={{ mb: 3 }}>
        <Tab label="Transactions" />
        <Tab label="Report" />
      </Tabs>
      {tab === 0 && (
        <>
          <FinanceForm onAdd={fetchTransactions} />
          <TransactionTable transactions={transactions} onDelete={fetchTransactions} />
        </>
      )}
      {tab === 1 && <ReportSection />}
    </Box>
  )
}

export default Finance
