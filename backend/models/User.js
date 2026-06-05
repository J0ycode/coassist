const mongoose = require('mongoose')
// const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return candidatePassword === this.password
}

module.exports = mongoose.model('User', userSchema)
