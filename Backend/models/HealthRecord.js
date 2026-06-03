const mongoose = require('mongoose')

const healthSchema = new mongoose.Schema({
  bloodPressure: {
    systolic: { type: Number, required: true },
    diastolic: { type: Number, required: true }
  },
  temperature: { type: Number, required: true },
  bloodOxygen: { type: Number, required: true },
  note: { type: String, default: '' },
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('HealthRecord', healthSchema)
