const express = require('express')
const router = express.Router()
const HealthRecord = require('../models/HealthRecord')

// POST / — save new health record
router.post('/', async (req, res) => {
  try {
    const { systolic, diastolic, temperature, bloodOxygen, note } = req.body
    const record = new HealthRecord({
      bloodPressure: { systolic, diastolic },
      temperature,
      bloodOxygen,
      note
    })
    const saved = await record.save()
    res.status(201).json(saved)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// GET / — get all records sorted by date descending
router.get('/', async (req, res) => {
  try {
    const records = await HealthRecord.find().sort({ date: -1 })
    res.json(records)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// DELETE /:id — delete a record by id
router.delete('/:id', async (req, res) => {
  try {
    await HealthRecord.findByIdAndDelete(req.params.id)
    res.json({ message: 'Record deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// GET /report — aggregated health stats
router.get('/report', async (req, res) => {
  try {
    const records = await HealthRecord.find()
    const totalRecords = records.length

    if (totalRecords === 0) {
      return res.json({
        totalRecords: 0,
        avgSystolic: 0,
        avgDiastolic: 0,
        avgTemperature: 0,
        avgBloodOxygen: 0,
        bpStatus: { normal: 0, elevated: 0, high: 0 }
      })
    }

    const avgSystolic = records.reduce((sum, r) => sum + r.bloodPressure.systolic, 0) / totalRecords
    const avgDiastolic = records.reduce((sum, r) => sum + r.bloodPressure.diastolic, 0) / totalRecords
    const avgTemperature = records.reduce((sum, r) => sum + r.temperature, 0) / totalRecords
    const avgBloodOxygen = records.reduce((sum, r) => sum + r.bloodOxygen, 0) / totalRecords

    const bpStatus = { normal: 0, elevated: 0, high: 0 }
    records.forEach(r => {
      const sys = r.bloodPressure.systolic
      const dia = r.bloodPressure.diastolic
      if (sys >= 130 || dia >= 80) {
        bpStatus.high++
      } else if (sys >= 120 && sys <= 129 && dia < 80) {
        bpStatus.elevated++
      } else {
        bpStatus.normal++
      }
    })

    res.json({
      totalRecords,
      avgSystolic: parseFloat(avgSystolic.toFixed(1)),
      avgDiastolic: parseFloat(avgDiastolic.toFixed(1)),
      avgTemperature: parseFloat(avgTemperature.toFixed(1)),
      avgBloodOxygen: parseFloat(avgBloodOxygen.toFixed(1)),
      bpStatus
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
