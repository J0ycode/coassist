import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Box, Typography, Paper, Grid, Chip, CircularProgress
} from '@mui/material'
import {
  PieChart, Pie, Tooltip, Legend, Cell
} from 'recharts'

const COLORS = ['#1a237e', '#e53935', '#43a047', '#fb8c00', '#8e24aa', '#00acc1', '#6d4c41']

function ReportSection() {
  const [financeReport, setFinanceReport] = useState(null)
  const [healthReport, setHealthReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [fRes, hRes] = await Promise.all([
          axios.get('/api/finance/report'),
          axios.get('/api/health/report')
        ])
        setFinanceReport(fRes.data)
        setHealthReport(hRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  const pieData = financeReport
    ? Object.entries(financeReport.expenseByCategory).map(([name, value]) => ({ name, value }))
    : []

  return (
    <Box>
      {/* Finance Report */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Finance Report</Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: 'Total Income', value: `₱${financeReport?.totalIncome?.toFixed(2) || '0.00'}`, color: '#e8f5e9', textColor: '#2e7d32' },
          { label: 'Total Expenses', value: `₱${financeReport?.totalExpenses?.toFixed(2) || '0.00'}`, color: '#ffebee', textColor: '#c62828' },
          { label: 'Net Balance', value: `₱${financeReport?.netBalance?.toFixed(2) || '0.00'}`, color: '#e3f2fd', textColor: '#1565c0' },
          { label: 'Savings Rate', value: financeReport?.savingsRate || '0.0%', color: '#f3e5f5', textColor: '#6a1b9a' }
        ].map((item, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper elevation={2} sx={{ p: 2, bgcolor: item.color, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">{item.label}</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: item.textColor }}>{item.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {pieData.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Expenses by Category</Typography>
          <PieChart width={300} height={300}>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(val) => `₱${val.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </Box>
      )}

      {/* Health Report */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Health Report</Typography>
      {healthReport && healthReport.totalRecords > 0 ? (
        <Box>
          <Typography>Total Records: {healthReport.totalRecords}</Typography>
          <Typography>Avg Systolic: {healthReport.avgSystolic} mmHg</Typography>
          <Typography>Avg Diastolic: {healthReport.avgDiastolic} mmHg</Typography>
          <Typography>Avg Temperature: {healthReport.avgTemperature} °F</Typography>
          <Typography>Avg SpO₂: {healthReport.avgBloodOxygen}%</Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Chip label={`Normal: ${healthReport.bpStatus.normal}`} sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 700 }} />
            <Chip label={`Elevated: ${healthReport.bpStatus.elevated}`} sx={{ bgcolor: '#fff8e1', color: '#f57f17', fontWeight: 700 }} />
            <Chip label={`High: ${healthReport.bpStatus.high}`} sx={{ bgcolor: '#ffebee', color: '#c62828', fontWeight: 700 }} />
          </Box>
        </Box>
      ) : (
        <Typography color="text.secondary">No health data yet.</Typography>
      )}
    </Box>
  )
}

export default ReportSection
