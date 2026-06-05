const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET || 'vitaLedger_secret_key_change_in_prod'

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided, authorization denied' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    
    // Check if user still exists
    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'Token is valid but user no longer exists' })
    }

    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

module.exports = authMiddleware
