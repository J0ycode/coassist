import { useState, useEffect } from 'react'
import { Grid, Card, Typography, Box, Chip } from '@mui/material'
import axios from 'axios'
import StatCard from '../components/dashboard/StatCard'
import FavoriteIcon from '@mui/icons-material/Favorite'
import AirIcon from '@mui/icons-material/Air'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts'

const CHART_COLORS = {
  systolic: '#ef5350',
  spO2: '#42a5f5',
  temperature: '#ffa726',
  income: '#66bb6a',
  expense: '#ef5350',
  pie: ['#5c6bc0', '#42a5f5', '#66bb6a', '#ffa726', '#ef5350', '#ab47bc', '#26c6da'],
}

const Home = () => {
  const [healthData, setHealthData] = useState([])
  const [financeData, setFinanceData] = useState({ summary: {}, reportData: [], categoryData: [] })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [healthRes, financeRes] = await Promise.all([
        axios.get('/api/health'),
        axios.get('/api/finance/report')
      ])
      setHealthData(healthRes.data)
      setFinanceData(financeRes.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  // Derived stats
  const totalHealthRecords = healthData.length
  const latestHealth = healthData.length > 0 ? healthData[0] : null
  const latestSpO2 = latestHealth ? latestHealth.bloodOxygen : 0

  const netBalance = financeData.summary?.netBalance || 0
  const savingsRate = financeData.summary?.savingsRate || '0%'

  // Charts data preparation
  const healthChartData = [...healthData].slice(0, 10).reverse().map(item => {
    const date = new Date(item.date)
    return {
      date: `${date.getDate()}/${date.getMonth() + 1}`,
      systolic: item.systolic,
      spO2: item.bloodOxygen,
      temperature: item.temperature
    }
  })

  // Mocking area chart data if backend reportData is empty or differently structured
  // Assuming financeData.reportData has { _id: 'YYYY-MM', income, expense }
  const financeChartData = (financeData.reportData || []).map(item => ({
    month: item._id,
    income: item.income,
    expense: item.expense
  }))

  const pieData = (financeData.categoryData || []).map(item => ({
    name: item._id,
    value: item.total
  }))

  const getBpColor = (status) => {
    if (status === 'Normal') return 'success'
    if (status === 'Elevated') return 'warning'
    return 'error'
  }

  return (
    <Grid container spacing={3}>
      {/* Row 1 - Stat Cards */}
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Total Health Records" value={totalHealthRecords} icon={<FavoriteIcon />} color="#ef5350" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Latest SpO2" value={`${latestSpO2}%`} icon={<AirIcon />} color="#42a5f5" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Net Balance" value={`₹ ${netBalance}`} icon={<AccountBalanceWalletIcon />} color="#5c6bc0" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Savings Rate" value={savingsRate} icon={<TrendingUpIcon />} color="#66bb6a" />
      </Grid>

      {/* Row 2 - Charts */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">Health Vitals Trend</Typography>
            <Typography variant="caption" color="text.secondary">Last 10 readings</Typography>
          </Box>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={healthChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <RechartsTooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="systolic" stroke={CHART_COLORS.systolic} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="spO2" stroke={CHART_COLORS.spO2} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="temperature" stroke={CHART_COLORS.temperature} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">Income vs Expenses</Typography>
            <Typography variant="caption" color="text.secondary">Monthly Overview</Typography>
          </Box>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={financeChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <RechartsTooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="income" stroke={CHART_COLORS.income} fillOpacity={0.15} fill={CHART_COLORS.income} />
              <Area type="monotone" dataKey="expense" stroke={CHART_COLORS.expense} fillOpacity={0.15} fill={CHART_COLORS.expense} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </Grid>

      {/* Row 3 - Summaries */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2.5, height: '100%' }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>Latest Health Reading</Typography>
          {latestHealth ? (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Blood Pressure</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6">{latestHealth.systolic}/{latestHealth.diastolic}</Typography>
                    <Chip size="small" label={latestHealth.bpStatus} color={getBpColor(latestHealth.bpStatus)} sx={{ height: 20, fontSize: '0.7rem' }} />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Temperature</Typography>
                  <Typography variant="h6">{latestHealth.temperature} °C</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">SpO2</Typography>
                  <Typography variant="h6">{latestHealth.bloodOxygen} %</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Date</Typography>
                  <Typography variant="subtitle1">{new Date(latestHealth.date).toLocaleDateString()}</Typography>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">No health records found.</Typography>
          )}
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2.5, height: '100%' }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>Finance Quick Summary</Typography>
          <Grid container alignItems="center">
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Total Income</Typography>
                <Typography variant="h6" color="success.main">₹ {financeData.summary?.totalIncome || 0}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Total Expenses</Typography>
                <Typography variant="h6" color="error.main">₹ {financeData.summary?.totalExpense || 0}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Net Balance</Typography>
                <Typography variant="h6" color="primary.main" fontWeight="bold">₹ {netBalance}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              {pieData.length > 0 ? (
                <PieChart width={200} height={200}>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS.pie[index % CHART_COLORS.pie.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              ) : (
                <Typography variant="caption" color="text.secondary">No expense data</Typography>
              )}
            </Grid>
          </Grid>
        </Card>
      </Grid>

    </Grid>
  )
}

export default Home
