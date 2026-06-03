import { Card, Grid, Box, Typography, alpha } from '@mui/material'

const StatCard = ({ title, value, icon, color }) => {
  return (
    <Card sx={{ p: 2.5 }}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '10px',
              backgroundColor: alpha(color, 0.12),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color
            }}
          >
            {icon}
          </Box>
        </Grid>
        <Grid item xs>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  )
}

export default StatCard
