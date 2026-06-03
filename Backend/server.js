require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const healthRoutes = require('./routes/health')
const financeRoutes = require('./routes/finance')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/health', healthRoutes)
app.use('/api/finance', financeRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`)
    })
  })
  .catch(err => {
    console.error('MongoDB connection error:', err)
  })
