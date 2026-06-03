const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET || 'vitaLedger_secret_key_change_in_prod'
const JWT_EXPIRES = '7d'

// ── Register ──────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password)
      return res.status(400).json({ message: 'Username and password are required' })

    if (username.length < 3)
      return res.status(400).json({ message: 'Username must be at least 3 characters' })

    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' })

    const existing = await User.findOne({ username: username.toLowerCase() })
    if (existing)
      return res.status(409).json({ message: 'Username already taken' })

    const user = new User({ username: username.toLowerCase(), password })
    await user.save()

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES })

    res.status(201).json({
      token,
      user: { id: user._id, username: user.username },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// ── Login ─────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password)
      return res.status(400).json({ message: 'Username and password are required' })

    const user = await User.findOne({ username: username.toLowerCase() })
    if (!user)
      return res.status(401).json({ message: 'Invalid username or password' })

    const isMatch = await user.comparePassword(password)
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid username or password' })

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES })

    res.json({
      token,
      user: { id: user._id, username: user.username },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// ── Verify token (used by frontend on load) ───────────────────
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer '))
      return res.status(401).json({ message: 'No token provided' })

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    if (!user) return res.status(401).json({ message: 'User not found' })

    res.json({ user: { id: user._id, username: user.username } })
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
})

module.exports = router
