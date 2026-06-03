import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Grid, Card, CardContent, Typography, CircularProgress, Box
} from '@mui/material'

function Home() {
  const [latestHealth, setLatestHealth] = useState(null)
  const [financeReport, setFinanceReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [healthRes, financeRes] = await Promise.all([
          axios.get('/api/health'),
          axios.get('/api/finance/report')
        ])
        setLatestHealth(healthRes.data[0] || null)
        setFinanceReport(financeRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderLeft: '5px solid #e53935' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Latest Health Reading
              </Typography>
              {latestHealth ? (
                <>
                  <Typography>
                    Blood Pressure: {latestHealth.bloodPressure.systolic}/{latestHealth.bloodPressure.diastolic} mmHg
                  </Typography>
                  <Typography>Temperature: {latestHealth.temperature} °F</Typography>
                  <Typography>Blood Oxygen (SpO₂): {latestHealth.bloodOxygen}%</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(latestHealth.date).toLocaleDateString()}
                  </Typography>
                </>
              ) : (
                <Typography color="text.secondary">No records yet</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderLeft: '5px solid #43a047' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Finance Summary
              </Typography>
              {financeReport ? (
                <>
                  <Typography>Total Income: ₱{financeReport.totalIncome.toFixed(2)}</Typography>
                  <Typography>Total Expenses: ₱{financeReport.totalExpenses.toFixed(2)}</Typography>
                  <Typography sx={{ fontWeight: 700 }}>
                    Net Balance: ₱{financeReport.netBalance.toFixed(2)}
                  </Typography>
                </>
              ) : (
                <Typography color="text.secondary">No finance data yet</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Home
