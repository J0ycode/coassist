import { useState, useEffect } from 'react'
import { Grid, Card, Typography, Box, Chip } from '@mui/material'
import axios from 'axios'
import StatCard from '../dashboard/StatCard'
import FavoriteIcon from '@mui/icons-material/Favorite'
import AirIcon from '@mui/icons-material/Air'
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts'

const CHART_COLORS = {
  systolic: '#ef5350',
  diastolic: '#ec407a',
  spO2: '#42a5f5',
  temperature: '#ffa726',
}

const HealthReport = () => {
  const [reportData, setReportData] = useState(null)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get('/api/health/report')
        setReportData(res.data)
      } catch (error) {
        console.error('Error fetching health report:', error)
      }
    }
    fetchReport()
  }, [])

  if (!reportData) return <Typography>Loading...</Typography>

  const summary = reportData.summary || {}
  const statusCounts = reportData.statusCounts || {}
  const chartData = (reportData.recentRecords || []).map(item => {
    const date = new Date(item.date)
    return {
      date: `${date.getDate()}/${date.getMonth() + 1}`,
      systolic: item.systolic,
      diastolic: item.diastolic,
      spO2: item.bloodOxygen,
      temperature: item.temperature
    }
  })

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Avg Systolic" value={Math.round(summary.avgSystolic || 0)} icon={<FavoriteIcon />} color="#ef5350" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Avg Diastolic" value={Math.round(summary.avgDiastolic || 0)} icon={<FavoriteIcon />} color="#ec407a" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Avg Temperature" value={(summary.avgTemperature || 0).toFixed(1)} icon={<DeviceThermostatIcon />} color="#ffa726" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Avg SpO2" value={Math.round(summary.avgBloodOxygen || 0)} icon={<AirIcon />} color="#42a5f5" />
        </Grid>
      </Grid>

      <Card sx={{ p: 2.5, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>Blood Pressure Status Breakdown</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip label={`Normal: ${statusCounts.Normal || 0}`} color="success" />
          <Chip label={`Elevated: ${statusCounts.Elevated || 0}`} color="warning" />
          <Chip label={`High: ${statusCounts.High || 0}`} color="error" />
        </Box>
      </Card>

      <Card sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">Vitals History</Typography>
          <Typography variant="caption" color="text.secondary">Last 10 records</Typography>
        </Box>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.08)" />
            <XAxis dataKey="date" />
            <YAxis />
            <RechartsTooltip />
            <Legend />
            <Line type="monotone" dataKey="systolic" stroke={CHART_COLORS.systolic} strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="diastolic" stroke={CHART_COLORS.diastolic} strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="spO2" stroke={CHART_COLORS.spO2} strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="temperature" stroke={CHART_COLORS.temperature} strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </Box>
  )
}

export default HealthReport
