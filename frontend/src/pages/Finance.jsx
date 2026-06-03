import { useState, useEffect } from 'react'
import { Box, Button, Collapse, Tabs, Tab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import axios from 'axios'
import FinanceForm from '../components/finance/FinanceForm'
import TransactionTable from '../components/finance/TransactionTable'
import FinanceReport from '../components/report/FinanceReport'

const Finance = () => {
  const [tabValue, setTabValue] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [transactions, setTransactions] = useState([])

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('/api/finance')
      setTransactions(res.data)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
          <Tab label="Transactions" />
          <Tab label="Report" />
        </Tabs>
        
        {tabValue === 0 && (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => setShowForm(!showForm)}
          >
            Add Transaction
          </Button>
        )}
      </Box>

      {tabValue === 0 && (
        <Box>
          <Collapse in={showForm}>
            <FinanceForm 
              onTransactionAdded={() => {
                fetchTransactions()
                setShowForm(false)
              }} 
              onCancel={() => setShowForm(false)} 
            />
          </Collapse>
          <TransactionTable transactions={transactions} onTransactionDeleted={fetchTransactions} />
        </Box>
      )}

      {tabValue === 1 && (
        <FinanceReport />
      )}
    </Box>
  )
}

export default Finance
