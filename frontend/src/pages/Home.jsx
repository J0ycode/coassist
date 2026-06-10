import { useState, useEffect } from 'react'
import { Grid, Card, Typography, Box, Chip, Divider, alpha, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, ToggleButton, ToggleButtonGroup } from '@mui/material'
import axios from 'axios'
import FavoriteIcon from '@mui/icons-material/Favorite'
import AirIcon from '@mui/icons-material/Air'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import ViewListIcon from '@mui/icons-material/ViewList'
import BarChartIcon from '@mui/icons-material/BarChart'
import {
  LineChart, Line, AreaChart, Area,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, RadialBarChart, RadialBar,
} from 'recharts'

/* ─── Design tokens ─────────────────────────────────────────── */
const C = {
  systolic:    '#ef5350',
  diastolic:   '#ec407a',
  spO2:        '#42a5f5',
  temperature: '#ffa726',
  income:      '#66bb6a',
  expense:     '#ef5350',
  primary:     '#5c6bc0',
  teal:        '#26c6da',
  pie: ['#5c6bc0','#42a5f5','#66bb6a','#ffa726','#ef5350','#ab47bc','#26c6da'],
}

/* ─── Custom Tooltip ─────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null

  // Check if it's a transaction (since transactions have a type or category)
  const isTransaction = payload[0]?.payload?.type || payload[0]?.payload?.category
  const transactionData = isTransaction ? payload[0]?.payload : null

  return (
    <Box sx={{
      background: 'rgba(30,30,50,0.92)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 2,
      p: 1.5,
      minWidth: 140,
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    }}>
      <Typography variant="caption" sx={{ color: '#aaa', display: 'block', mb: 0.5 }}>{label}</Typography>
      {payload.map((p, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: p.color || C.expense }} />
          <Typography variant="caption" sx={{ color: '#fff' }}>
            {p.name}: <strong>{typeof p.value === 'number' && (p.name.includes('Amount') || p.name === 'value') ? `₹${p.value.toLocaleString()}` : p.value}</strong>
          </Typography>
        </Box>
      ))}
      {transactionData && (
        <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="caption" sx={{ display: 'block', color: '#80d8ff', fontWeight: 'bold' }}>
            Category: {transactionData.category}
          </Typography>
          {transactionData.description && (
            <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', mt: 0.25 }}>
              "{transactionData.description}"
            </Typography>
          )}
        </Box>
      )}
    </Box>
  )
}

/* ─── Gradient Stat Card ─────────────────────────────────────── */
const GradCard = ({ title, value, sub, icon, grad, chip, chipColor }) => (
  <Card sx={{
    p: 2.5,
    background: grad,
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 30px rgba(0,0,0,0.18)' },
  }}>
    {/* decorative circle */}
    <Box sx={{
      position: 'absolute', right: -20, top: -20,
      width: 100, height: 100, borderRadius: '50%',
      background: 'rgba(255,255,255,0.12)',
    }} />
    <Box sx={{
      position: 'absolute', right: 20, bottom: -30,
      width: 70, height: 70, borderRadius: '50%',
      background: 'rgba(255,255,255,0.07)',
    }} />
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <Box>
        <Typography variant="body2" sx={{ opacity: 0.85, mb: 0.5 }}>{title}</Typography>
        <Typography variant="h4" fontWeight="bold" sx={{ lineHeight: 1.1 }}>{value}</Typography>
        {sub && <Typography variant="caption" sx={{ opacity: 0.75 }}>{sub}</Typography>}
      </Box>
      <Box sx={{
        bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '10px',
        p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </Box>
    </Box>
    {chip && (
      <Chip
        label={chip} size="small"
        sx={{
          mt: 1.5,
          bgcolor: chipColor || 'rgba(255,255,255,0.25)',
          color: '#fff', fontWeight: 600, fontSize: '0.7rem',
        }}
      />
    )}
  </Card>
)

/* ─── Section header ─────────────────────────────────────────── */
const SectionHeader = ({ title, sub }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2 }}>
    <Typography variant="h6" fontWeight="bold">{title}</Typography>
    {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
  </Box>
)

/* ─── Radial Gauge ───────────────────────────────────────────── */
const RadialGauge = ({ value, max, color, label, unit }) => {
  const pct = Math.min(100, Math.round((value / max) * 100))
  const data = [{ name: label, value: pct, fill: color }]
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ position: 'relative', width: 130, height: 130 }}>
        <RadialBarChart
          width={130} height={130}
          cx={65} cy={65}
          innerRadius={45} outerRadius={60}
          startAngle={225} endAngle={-45}
          data={data}
          barSize={12}
        >
          <RadialBar background={{ fill: alpha(color, 0.12) }} dataKey="value" />
        </RadialBarChart>
        <Box sx={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color, lineHeight: 1 }}>{value}</Typography>
          <Typography variant="caption" color="text.secondary">{unit}</Typography>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" mt={0.5}>{label}</Typography>
    </Box>
  )
}

/* ─── Donut Legend ───────────────────────────────────────────── */
const DonutLegend = ({ data }) => (
  <Box>
    {data.map((d, i) => (
      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
        <Box sx={{ width: 10, height: 10, borderRadius: 1, bgcolor: C.pie[i % C.pie.length], flexShrink: 0 }} />
        <Typography variant="caption" sx={{ flex: 1, color: 'text.secondary' }}>{d.name}</Typography>
        <Typography variant="caption" fontWeight="bold">₹{d.value.toLocaleString()}</Typography>
      </Box>
    ))}
  </Box>
)

/* ═══════════════════════════════════════════════════════════════
   HOME DASHBOARD
═══════════════════════════════════════════════════════════════ */
const Home = () => {
  const [healthData, setHealthData]   = useState([])
  const [financeData, setFinanceData] = useState({ summary: {}, expenseByCategory: {} })
  const [transactions, setTransactions] = useState([])

  // Sorting state for Health
  const [healthSortField, setHealthSortField] = useState('date')
  const [healthSortOrder, setHealthSortOrder] = useState('desc') // 'asc' | 'desc'

  // Sorting state for Expense
  const [expenseSortField, setExpenseSortField] = useState('date')
  const [expenseSortOrder, setExpenseSortOrder] = useState('desc') // 'asc' | 'desc'

  // View mode for the Comparison Log: 'table' | 'chart'
  const [viewMode, setViewMode] = useState('table')

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const [healthRes, financeRes, transRes] = await Promise.all([
        axios.get('/api/health'),
        axios.get('/api/finance/report'),
        axios.get('/api/finance'),
      ])
      setHealthData(healthRes.data)
      setFinanceData(financeRes.data)
      setTransactions(transRes.data)
    } catch (err) {
      console.error('Dashboard fetch error:', err)
    }
  }

  const handleHealthSort = (field) => {
    const isAsc = healthSortField === field && healthSortOrder === 'asc'
    setHealthSortOrder(isAsc ? 'desc' : 'asc')
    setHealthSortField(field)
  }

  const handleExpenseSort = (field) => {
    const isAsc = expenseSortField === field && expenseSortOrder === 'asc'
    setExpenseSortOrder(isAsc ? 'desc' : 'asc')
    setExpenseSortField(field)
  }

  /* ── derived data ── */
  const latest         = healthData[0] || null
  const latestSystolic = latest?.bloodPressure?.systolic ?? latest?.systolic ?? 0
  const latestDiastolic= latest?.bloodPressure?.diastolic ?? latest?.diastolic ?? 0
  const latestSpO2     = latest?.bloodOxygen ?? 0
  const latestTemp     = latest?.temperature ?? 0

  const getBpStatus = (sys, dia) => {
    if (sys >= 130 || dia >= 80) return { label: 'High BP', color: 'error' }
    if (sys >= 120 && sys <= 129 && dia < 80) return { label: 'Elevated', color: 'warning' }
    return { label: 'Normal', color: 'success' }
  }
  const bpStatus = getBpStatus(latestSystolic, latestDiastolic)

  const netBalance = financeData.netBalance ?? financeData.summary?.netBalance ?? 0
  const savingsRate = financeData.savingsRate ?? financeData.summary?.savingsRate ?? '0%'
  const totalIncome = financeData.totalIncome ?? financeData.summary?.totalIncome ?? 0
  const totalExpenses = financeData.totalExpenses ?? financeData.summary?.totalExpenses ?? 0

  /* ── Vitals line/area chart data (last 10) ── */
  const vitalsData = [...healthData].slice(0, 10).reverse().map(r => {
    const d = new Date(r.date)
    return {
      date: `${d.getDate()}/${d.getMonth() + 1}`,
      Systolic:    r.bloodPressure?.systolic ?? r.systolic,
      Diastolic:   r.bloodPressure?.diastolic ?? r.diastolic,
      SpO2:        r.bloodOxygen,
      Temperature: r.temperature,
    }
  })

  /* ── BP status counts ── */
  const bpCounts = { Normal: 0, Elevated: 0, High: 0 }
  healthData.forEach(r => {
    const s = r.bloodPressure?.systolic ?? r.systolic ?? 0
    const d = r.bloodPressure?.diastolic ?? r.diastolic ?? 0
    if (s >= 130 || d >= 80) bpCounts.High++
    else if (s >= 120 && s < 130 && d < 80) bpCounts.Elevated++
    else bpCounts.Normal++
  })
  const bpBarData = [
    { name: 'Normal',   value: bpCounts.Normal,   fill: '#66bb6a' },
    { name: 'Elevated', value: bpCounts.Elevated, fill: '#ffa726' },
    { name: 'High BP',  value: bpCounts.High,     fill: '#ef5350' },
  ]

  /* ── Finance donut (expense by category) ── */
  const catObj = financeData.expenseByCategory || {}
  const pieData = Object.entries(catObj).map(([k, v]) => ({ name: k, value: v }))

  /* ── Income/Expense summary bars ── */
  const summaryBars = [
    { name: 'Income',   value: totalIncome,   fill: '#66bb6a' },
    { name: 'Expenses', value: totalExpenses, fill: '#ef5350' },
    { name: 'Balance',  value: Math.abs(netBalance), fill: netBalance >= 0 ? '#5c6bc0' : '#ab47bc' },
  ]

  /* ── sorted health data ── */
  const sortedHealthData = [...healthData].sort((a, b) => {
    let valA, valB;
    if (healthSortField === 'date') {
      valA = new Date(a.date).getTime()
      valB = new Date(b.date).getTime()
    } else if (healthSortField === 'systolic') {
      valA = a.bloodPressure?.systolic ?? a.systolic ?? 0
      valB = b.bloodPressure?.systolic ?? b.systolic ?? 0
    } else if (healthSortField === 'diastolic') {
      valA = a.bloodPressure?.diastolic ?? a.diastolic ?? 0
      valB = b.bloodPressure?.diastolic ?? b.diastolic ?? 0
    } else if (healthSortField === 'bloodOxygen') {
      valA = a.bloodOxygen ?? 0
      valB = b.bloodOxygen ?? 0
    } else if (healthSortField === 'temperature') {
      valA = a.temperature ?? 0
      valB = b.temperature ?? 0
    } else {
      valA = 0
      valB = 0
    }

    if (healthSortOrder === 'asc') {
      return valA > valB ? 1 : -1
    } else {
      return valA < valB ? 1 : -1
    }
  })

  /* ── sorted finance data (income & expense) ── */
  const financeTransactions = transactions

  const sortedExpenseData = [...financeTransactions].sort((a, b) => {
    let valA, valB;
    if (expenseSortField === 'date') {
      valA = new Date(a.date).getTime()
      valB = new Date(b.date).getTime()
    } else if (expenseSortField === 'amount') {
      valA = a.amount ?? 0
      valB = b.amount ?? 0
    } else if (expenseSortField === 'category') {
      valA = (a.category ?? '').toLowerCase()
      valB = (b.category ?? '').toLowerCase()
    } else if (expenseSortField === 'description') {
      valA = (a.description ?? '').toLowerCase()
      valB = (b.description ?? '').toLowerCase()
    } else if (expenseSortField === 'type') {
      valA = (a.type ?? '').toLowerCase()
      valB = (b.type ?? '').toLowerCase()
    } else {
      valA = 0
      valB = 0
    }

    if (expenseSortOrder === 'asc') {
      return valA > valB ? 1 : -1
    } else {
      return valA < valB ? 1 : -1
    }
  })

  /* ── chart data mapping ── */
  const healthChartData = sortedHealthData.map(r => {
    const d = new Date(r.date)
    return {
      ...r,
      formattedDate: `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`,
      Systolic: r.bloodPressure?.systolic ?? r.systolic ?? 0,
      Diastolic: r.bloodPressure?.diastolic ?? r.diastolic ?? 0,
      SpO2: r.bloodOxygen ?? 0,
      Temp: r.temperature ?? 0,
    }
  })

  const expenseChartData = sortedExpenseData.map(t => {
    const d = new Date(t.date)
    return {
      ...t,
      formattedDate: `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`,
      Income: t.type === 'income' ? t.amount : 0,
      Expense: t.type === 'expense' ? t.amount : 0,
      Amount: t.amount,
    }
  })

  return (
    <Grid container spacing={3}>

      {/* ══ Row 1 — Gradient Stat Cards ══════════════════════════ */}
      <Grid item xs={12} sm={6} md={3}>
        <GradCard
          title="Total Health Records"
          value={healthData.length}
          sub="All time"
          icon={<FavoriteIcon />}
          grad="linear-gradient(135deg, #ef5350 0%, #e53935 100%)"
          chip={`Latest: ${latestSystolic}/${latestDiastolic} mmHg`}
          chipColor="rgba(0,0,0,0.2)"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <GradCard
          title="Blood Oxygen (SpO2)"
          value={`${latestSpO2}%`}
          sub={latestSpO2 >= 95 ? 'Healthy range' : latestSpO2 > 0 ? 'Monitor closely' : 'No data'}
          icon={<AirIcon />}
          grad="linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%)"
          chip={latestSpO2 >= 95 ? '✓ Normal' : latestSpO2 > 0 ? '⚠ Low' : '—'}
          chipColor={latestSpO2 >= 95 ? 'rgba(102,187,106,0.4)' : 'rgba(255,167,38,0.4)'}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <GradCard
          title="Net Balance"
          value={`₹${netBalance.toLocaleString()}`}
          sub={`Savings rate: ${savingsRate}`}
          icon={<AccountBalanceWalletIcon />}
          grad="linear-gradient(135deg, #5c6bc0 0%, #3949ab 100%)"
          chip={netBalance >= 0 ? '↑ Surplus' : '↓ Deficit'}
          chipColor={netBalance >= 0 ? 'rgba(102,187,106,0.4)' : 'rgba(239,83,80,0.4)'}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <GradCard
          title="Body Temperature"
          value={`${latestTemp}°C`}
          sub={latestTemp >= 37.5 ? 'Above normal' : latestTemp > 0 ? 'Normal range' : 'No data'}
          icon={<DeviceThermostatIcon />}
          grad="linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)"
          chip={latestTemp >= 37.5 ? '⚠ Fever check' : latestTemp > 0 ? '✓ Normal' : '—'}
          chipColor={latestTemp >= 37.5 ? 'rgba(239,83,80,0.4)' : 'rgba(102,187,106,0.4)'}
        />
      </Grid>

      {/* ══ Row 2 — BP Gauges + Latest Reading ═══════════════════ */}
      <Grid item xs={12} md={4}>
        <Card sx={{ p: 2.5, height: '100%' }}>
          <SectionHeader title="Live Vitals Gauge" sub="Latest reading" />
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 1 }}>
            <RadialGauge value={latestSystolic} max={180} color={C.systolic}    label="Systolic"   unit="mmHg" />
            <RadialGauge value={latestDiastolic} max={120} color={C.diastolic}  label="Diastolic"  unit="mmHg" />
            <RadialGauge value={latestSpO2}      max={100} color={C.spO2}       label="SpO2"       unit="%"    />
            <RadialGauge value={latestTemp}      max={42}  color={C.temperature} label="Temp"      unit="°C"   />
          </Box>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Chip
              label={bpStatus.label}
              color={bpStatus.color}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>
        </Card>
      </Grid>

      {/* ── Health Vitals Area Chart ── */}
      <Grid item xs={12} md={8}>
        <Card sx={{ p: 2.5, height: '100%' }}>
          <SectionHeader title="Health Vitals Trend" sub="Last 10 readings" />
          {vitalsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={vitalsData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="gradSys" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.systolic}    stopOpacity={0.25} />
                    <stop offset="95%" stopColor={C.systolic}    stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradDia" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.diastolic}   stopOpacity={0.25} />
                    <stop offset="95%" stopColor={C.diastolic}   stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradSpo2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.spO2}        stopOpacity={0.2} />
                    <stop offset="95%" stopColor={C.spO2}        stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.temperature} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={C.temperature} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.08)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="Systolic"    stroke={C.systolic}    fill="url(#gradSys)"  strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Area type="monotone" dataKey="Diastolic"   stroke={C.diastolic}   fill="url(#gradDia)"  strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Area type="monotone" dataKey="SpO2"        stroke={C.spO2}        fill="url(#gradSpo2)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Area type="monotone" dataKey="Temperature" stroke={C.temperature} fill="url(#gradTemp)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">No health records yet</Typography>
            </Box>
          )}
        </Card>
      </Grid>

      {/* ══ Row 3 — BP Status Distribution + Finance Summary ═════ */}
      <Grid item xs={12} md={5}>
        <Card sx={{ p: 2.5, height: '100%' }}>
          <SectionHeader title="BP Status Distribution" sub={`${healthData.length} total records`} />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={bpBarData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={64} />
              <RechartsTooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} label={{ position: 'right', fontSize: 12, fill: '#fff' }}>
                {bpBarData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <Divider sx={{ my: 1.5 }} />
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label={`Normal: ${bpCounts.Normal}`}    size="small" color="success" />
            <Chip label={`Elevated: ${bpCounts.Elevated}`} size="small" color="warning" />
            <Chip label={`High: ${bpCounts.High}`}         size="small" color="error"   />
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} md={7}>
        <Card sx={{ p: 2.5, height: '100%' }}>
          <SectionHeader title="Finance Overview" sub="Income · Expenses · Balance" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={summaryBars} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.08)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <RechartsTooltip
                content={<CustomTooltip />}
                formatter={v => `₹${v.toLocaleString()}`}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {summaryBars.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <Divider sx={{ my: 1.5 }} />
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Total Income</Typography>
              <Typography variant="subtitle1" fontWeight="bold" color="success.main">₹{totalIncome.toLocaleString()}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Total Expenses</Typography>
              <Typography variant="subtitle1" fontWeight="bold" color="error.main">₹{totalExpenses.toLocaleString()}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Net Balance</Typography>
              <Typography variant="subtitle1" fontWeight="bold" color={netBalance >= 0 ? 'primary.main' : 'error.main'}>₹{netBalance.toLocaleString()}</Typography>
            </Box>
          </Box>
        </Card>
      </Grid>

      {/* ══ Row 4 — Expense Donut + Latest Health Reading ════════ */}
      <Grid item xs={12} md={5}>
        <Card sx={{ p: 2.5, height: '100%' }}>
          <SectionHeader title="Expense by Category" sub="Donut breakdown" />
          {pieData.length > 0 ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <PieChart width={160} height={160}>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  innerRadius={50} outerRadius={72}
                  paddingAngle={4} dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={C.pie[i % C.pie.length]} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
              <Box sx={{ flex: 1, minWidth: 120 }}>
                <DonutLegend data={pieData} />
              </Box>
            </Box>
          ) : (
            <Box sx={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary" variant="body2">No expense data yet</Typography>
            </Box>
          )}
        </Card>
      </Grid>

      <Grid item xs={12} md={7}>
        <Card sx={{ p: 2.5, height: '100%' }}>
          <SectionHeader title="Latest Health Reading" sub={latest ? new Date(latest.date).toLocaleString() : ''} />
          {latest ? (
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              {[
                { label: 'Blood Pressure', value: `${latestSystolic}/${latestDiastolic} mmHg`, color: C.systolic,    bg: alpha(C.systolic, 0.08),    icon: <FavoriteIcon fontSize="small" /> },
                { label: 'SpO2',           value: `${latestSpO2} %`,                           color: C.spO2,        bg: alpha(C.spO2, 0.08),        icon: <AirIcon fontSize="small" /> },
                { label: 'Temperature',    value: `${latestTemp} °C`,                          color: C.temperature, bg: alpha(C.temperature, 0.08), icon: <DeviceThermostatIcon fontSize="small" /> },
                { label: 'BP Status',      value: bpStatus.label,                              color: bpStatus.color === 'success' ? '#66bb6a' : bpStatus.color === 'warning' ? '#ffa726' : '#ef5350', bg: alpha(bpStatus.color === 'success' ? '#66bb6a' : '#ef5350', 0.08), icon: <ShowChartIcon fontSize="small" /> },
              ].map((item, i) => (
                <Grid item xs={6} key={i}>
                  <Box sx={{
                    p: 1.5, borderRadius: 2,
                    bgcolor: item.bg,
                    border: `1px solid ${alpha(item.color, 0.15)}`,
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5, color: item.color }}>
                      {item.icon}
                      <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: item.color }}>{item.value}</Typography>
                  </Box>
                </Grid>
              ))}
              {latest.note && (
                <Grid item xs={12}>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
                    <Typography variant="caption" color="text.secondary">Note</Typography>
                    <Typography variant="body2">{latest.note}</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          ) : (
            <Box sx={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">No health records found</Typography>
            </Box>
          )}
        </Card>
      </Grid>

      {/* ══ Row 5 — Historical Logs & Comparison ═══════════════════ */}
      <Grid item xs={12}>
        <Card sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight="bold">Past Recordings & Comparison</Typography>
              <Typography variant="caption" color="text.secondary">Sort and compare your health vitals & expense records side by side</Typography>
            </Box>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => { if (newMode) setViewMode(newMode) }}
              sx={{
                border: '1px solid rgba(255,255,255,0.12)',
                bgcolor: 'rgba(255,255,255,0.03)',
                '& .MuiToggleButton-root': {
                  color: 'rgba(255,255,255,0.6)',
                  border: 'none',
                  px: 2,
                  py: 0.5,
                  borderRadius: '10px !important',
                  margin: '3px',
                  transition: 'all 0.2s',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  '&.Mui-selected': {
                    color: '#fff',
                    background: 'linear-gradient(90deg, #5c6bc0, #42a5f5)',
                    boxShadow: '0 2px 10px rgba(92,107,192,0.3)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #4a57a8, #2196f3)',
                    }
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.08)',
                    color: '#fff'
                  }
                }
              }}
            >
              <ToggleButton value="table">
                <ViewListIcon fontSize="small" sx={{ mr: 0.5 }} /> Table View
              </ToggleButton>
              <ToggleButton value="chart">
                <BarChartIcon fontSize="small" sx={{ mr: 0.5 }} /> Chart View
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.08)' }} />
          
          <Grid container spacing={4}>
            {/* Left Column: Health Recordings */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#ef5350', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FavoriteIcon fontSize="small" /> Health Vitals Log {viewMode === 'chart' && 'Chart'}
                </Typography>
                <Chip label={`${healthData.length} records`} size="small" sx={{ bgcolor: 'rgba(239,83,80,0.15)', color: '#fff', fontWeight: 600 }} />
              </Box>
              
              {viewMode === 'table' ? (
                <TableContainer sx={{ maxHeight: 350, border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 2, bgcolor: 'rgba(255,255,255,0.01)' }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.9)', bgcolor: 'rgba(30, 30, 50, 0.95)' }}>
                          <TableSortLabel
                            active={healthSortField === 'date'}
                            direction={healthSortField === 'date' ? healthSortOrder : 'asc'}
                            onClick={() => handleHealthSort('date')}
                            sx={{
                              color: 'rgba(255,255,255,0.9) !important',
                              '& .MuiTableSortLabel-icon': { color: '#42a5f5 !important' }
                            }}
                          >
                            Date
                          </TableSortLabel>
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.9)', bgcolor: 'rgba(30, 30, 50, 0.95)' }}>
                          <TableSortLabel
                            active={healthSortField === 'systolic'}
                            direction={healthSortField === 'systolic' ? healthSortOrder : 'asc'}
                            onClick={() => handleHealthSort('systolic')}
                            sx={{
                              color: 'rgba(255,255,255,0.9) !important',
                              '& .MuiTableSortLabel-icon': { color: '#42a5f5 !important' }
                            }}
                          >
                            BP
                          </TableSortLabel>
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.9)', bgcolor: 'rgba(30, 30, 50, 0.95)' }}>
                          <TableSortLabel
                            active={healthSortField === 'bloodOxygen'}
                            direction={healthSortField === 'bloodOxygen' ? healthSortOrder : 'asc'}
                            onClick={() => handleHealthSort('bloodOxygen')}
                            sx={{
                              color: 'rgba(255,255,255,0.9) !important',
                              '& .MuiTableSortLabel-icon': { color: '#42a5f5 !important' }
                            }}
                          >
                            SpO2
                          </TableSortLabel>
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.9)', bgcolor: 'rgba(30, 30, 50, 0.95)' }}>
                          <TableSortLabel
                            active={healthSortField === 'temperature'}
                            direction={healthSortField === 'temperature' ? healthSortOrder : 'asc'}
                            onClick={() => handleHealthSort('temperature')}
                            sx={{
                              color: 'rgba(255,255,255,0.9) !important',
                              '& .MuiTableSortLabel-icon': { color: '#42a5f5 !important' }
                            }}
                          >
                            Temp
                          </TableSortLabel>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.9)', bgcolor: 'rgba(30, 30, 50, 0.95)' }}>Note</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedHealthData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                            <Typography variant="body2" color="text.secondary">No health records yet</Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        sortedHealthData.map((row) => {
                          const d = new Date(row.date)
                          const formattedDate = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
                          const sys = row.bloodPressure?.systolic ?? row.systolic ?? 0
                          const dia = row.bloodPressure?.diastolic ?? row.diastolic ?? 0
                          return (
                            <TableRow key={row._id} hover sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.04) !important' } }}>
                              <TableCell sx={{ fontSize: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{formattedDate}</TableCell>
                              <TableCell align="center" sx={{ fontSize: '0.8rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                {sys}/{dia}
                              </TableCell>
                              <TableCell align="center" sx={{ fontSize: '0.8rem', color: C.spO2, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.bloodOxygen}%</TableCell>
                              <TableCell align="center" sx={{ fontSize: '0.8rem', color: C.temperature, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.temperature}°C</TableCell>
                              <TableCell sx={{ fontSize: '0.8rem', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                {row.note || '-'}
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 2, p: 2, bgcolor: 'rgba(255,255,255,0.01)', height: 350, display: 'flex', flexDirection: 'column' }}>
                  {healthChartData.length === 0 ? (
                    <Typography align="center" color="text.secondary" sx={{ my: 'auto' }}>No health records to plot</Typography>
                  ) : (
                    <>
                      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={healthChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                            <defs>
                              <linearGradient id="compSys" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor={C.systolic}    stopOpacity={0.25} />
                                <stop offset="95%" stopColor={C.systolic}    stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="compDia" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor={C.diastolic}   stopOpacity={0.25} />
                                <stop offset="95%" stopColor={C.diastolic}   stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="compSpo2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor={C.spO2}        stopOpacity={0.2} />
                                <stop offset="95%" stopColor={C.spO2}        stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="compTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor={C.temperature} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={C.temperature} stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.08)" />
                            <XAxis dataKey="formattedDate" tick={{ fontSize: 9 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Area type="monotone" name="Systolic" dataKey="Systolic" stroke={C.systolic} fill="url(#compSys)" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} />
                            <Area type="monotone" name="Diastolic" dataKey="Diastolic" stroke={C.diastolic} fill="url(#compDia)" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} />
                            <Area type="monotone" name="SpO2" dataKey="SpO2" stroke={C.spO2} fill="url(#compSpo2)" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} />
                            <Area type="monotone" name="Temperature" dataKey="Temp" stroke={C.temperature} fill="url(#compTemp)" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </Box>
                      {/* Hint / Legend */}
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 1, pt: 1, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        {[
                          { label: 'Systolic BP', color: C.systolic },
                          { label: 'Diastolic BP', color: C.diastolic },
                          { label: 'Blood Oxygen (SpO2)', color: C.spO2 },
                          { label: 'Temperature', color: C.temperature },
                        ].map((hint, i) => (
                          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: hint.color }} />
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem' }}>
                              {hint.label}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </>
                  )}
                </Box>
              )}
            </Grid>

            {/* Right Column: Finance Recordings */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#ffa726', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalanceWalletIcon fontSize="small" /> Income & Expense Log {viewMode === 'chart' && 'Chart'}
                </Typography>
                <Chip label={`${financeTransactions.length} records`} size="small" sx={{ bgcolor: 'rgba(255,167,38,0.15)', color: '#fff', fontWeight: 600 }} />
              </Box>

              {viewMode === 'table' ? (
                <TableContainer sx={{ maxHeight: 350, border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 2, bgcolor: 'rgba(255,255,255,0.01)' }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.9)', bgcolor: 'rgba(30, 30, 50, 0.95)' }}>
                          <TableSortLabel
                            active={expenseSortField === 'date'}
                            direction={expenseSortField === 'date' ? expenseSortOrder : 'asc'}
                            onClick={() => handleExpenseSort('date')}
                            sx={{
                              color: 'rgba(255,255,255,0.9) !important',
                              '& .MuiTableSortLabel-icon': { color: '#42a5f5 !important' }
                            }}
                          >
                            Date
                          </TableSortLabel>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.9)', bgcolor: 'rgba(30, 30, 50, 0.95)' }}>
                          <TableSortLabel
                            active={expenseSortField === 'type'}
                            direction={expenseSortField === 'type' ? expenseSortOrder : 'asc'}
                            onClick={() => handleExpenseSort('type')}
                            sx={{
                              color: 'rgba(255,255,255,0.9) !important',
                              '& .MuiTableSortLabel-icon': { color: '#42a5f5 !important' }
                            }}
                          >
                            Type
                          </TableSortLabel>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.9)', bgcolor: 'rgba(30, 30, 50, 0.95)' }}>
                          <TableSortLabel
                            active={expenseSortField === 'amount'}
                            direction={expenseSortField === 'amount' ? expenseSortOrder : 'asc'}
                            onClick={() => handleExpenseSort('amount')}
                            sx={{
                              color: 'rgba(255,255,255,0.9) !important',
                              '& .MuiTableSortLabel-icon': { color: '#42a5f5 !important' }
                            }}
                          >
                            Amount
                          </TableSortLabel>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.9)', bgcolor: 'rgba(30, 30, 50, 0.95)' }}>
                          <TableSortLabel
                            active={expenseSortField === 'category'}
                            direction={expenseSortField === 'category' ? expenseSortOrder : 'asc'}
                            onClick={() => handleExpenseSort('category')}
                            sx={{
                              color: 'rgba(255,255,255,0.9) !important',
                              '& .MuiTableSortLabel-icon': { color: '#42a5f5 !important' }
                            }}
                          >
                            Category
                          </TableSortLabel>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.9)', bgcolor: 'rgba(30, 30, 50, 0.95)' }}>
                          <TableSortLabel
                            active={expenseSortField === 'description'}
                            direction={expenseSortField === 'description' ? expenseSortOrder : 'asc'}
                            onClick={() => handleExpenseSort('description')}
                            sx={{
                              color: 'rgba(255,255,255,0.9) !important',
                              '& .MuiTableSortLabel-icon': { color: '#42a5f5 !important' }
                            }}
                          >
                            Description
                          </TableSortLabel>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedExpenseData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                            <Typography variant="body2" color="text.secondary">No finance records yet</Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        sortedExpenseData.map((row) => {
                          const d = new Date(row.date)
                          const formattedDate = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
                          const isInc = row.type === 'income'
                          return (
                            <TableRow key={row._id} hover sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.04) !important' } }}>
                              <TableCell sx={{ fontSize: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{formattedDate}</TableCell>
                              <TableCell sx={{ fontSize: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <Chip 
                                  label={isInc ? 'Income' : 'Expense'} 
                                  size="small" 
                                  variant="outlined" 
                                  color={isInc ? 'success' : 'error'}
                                  sx={{ height: 20, fontSize: '0.65rem', fontWeight: 'bold' }} 
                                />
                              </TableCell>
                              <TableCell align="right" sx={{ fontSize: '0.8rem', fontWeight: 600, color: isInc ? C.income : C.expense, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                {isInc ? '+' : '-'} ₹{row.amount.toLocaleString()}
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <Chip label={row.category} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem', borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }} />
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.8rem', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                {row.description || '-'}
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 2, p: 2, bgcolor: 'rgba(255,255,255,0.01)', height: 350, display: 'flex', flexDirection: 'column' }}>
                  {expenseChartData.length === 0 ? (
                    <Typography align="center" color="text.secondary" sx={{ my: 'auto' }}>No finance records to plot</Typography>
                  ) : (
                    <>
                      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={expenseChartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.08)" />
                            <XAxis dataKey="formattedDate" tick={{ fontSize: 9 }} />
                            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${v}`} />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Bar name="Income" dataKey="Income" fill={C.income} radius={[4, 4, 0, 0]} maxBarSize={25} />
                            <Bar name="Expense" dataKey="Expense" fill={C.expense} radius={[4, 4, 0, 0]} maxBarSize={25} />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                      {/* Hint / Legend */}
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center', mt: 1, pt: 1, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        {[
                          { label: 'Income', color: C.income },
                          { label: 'Expense', color: C.expense },
                        ].map((hint, i) => (
                          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: hint.color }} />
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem' }}>
                              {hint.label}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </>
                  )}
                </Box>
              )}
            </Grid>
          </Grid>
        </Card>
      </Grid>

    </Grid>
  )
}

export default Home
