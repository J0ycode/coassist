import { useState, useEffect } from 'react'
import { Grid, Card, Typography, Box } from '@mui/material'
import axios from 'axios'
import StatCard from '../dashboard/StatCard'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts'

const CHART_COLORS = {
  income: '#66bb6a',
  expense: '#ef5350',
  pie: ['#5c6bc0', '#42a5f5', '#66bb6a', '#ffa726', '#ef5350', '#ab47bc', '#26c6da'],
}

const FinanceReport = () => {
  const [reportData, setReportData] = useState({ summary: {}, reportData: [], categoryData: [] })

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get('/api/finance/report')
        setReportData(res.data)
      } catch (error) {
        console.error('Error fetching finance report:', error)
      }
    }
    fetchReport()
  }, [])

  const pieData = (reportData.categoryData || []).map(item => ({
    name: item._id,
    value: item.total
  }))

  const barData = (reportData.reportData || []).map(item => ({
    month: item._id,
    Income: item.income,
    Expense: item.expense
  }))

  const summary = reportData.summary || {}

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Income" value={`₹ ${summary.totalIncome || 0}`} icon={<TrendingUpIcon />} color="#66bb6a" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Expenses" value={`₹ ${summary.totalExpense || 0}`} icon={<TrendingDownIcon />} color="#ef5350" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Net Balance" value={`₹ ${summary.netBalance || 0}`} icon={<AccountBalanceWalletIcon />} color="#5c6bc0" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Savings Rate" value={summary.savingsRate || '0%'} icon={<MonetizationOnIcon />} color="#ffa726" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>Expense by Category</Typography>
            <ResponsiveContainer width="100%" height={300}>
              {pieData.length > 0 ? (
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS.pie[index % CHART_COLORS.pie.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              ) : (
                <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">No category data available</Typography>
                </Box>
              )}
            </ResponsiveContainer>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>Income vs Expenses Comparison</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.08)" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                <Legend />
                <Bar dataKey="Income" fill={CHART_COLORS.income} radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="Expense" fill={CHART_COLORS.expense} radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default FinanceReport
