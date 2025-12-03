const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    default: 'demo123' // For demo purposes
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  sessionsCreated: {
    type: Number,
    default: 0
  },
  sessionsAttended: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  },
  badges: [{
    type: String
  }],
  profilePicture: {
    type: String,
    default: null
  }
  ,
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
