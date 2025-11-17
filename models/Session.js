const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  skillLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  maxSeats: {
    type: Number,
    default: null
  },
  prerequisites: {
    type: String,
    default: ''
  },
  creatorId: {
    type: String,
    required: true,
    ref: 'User'
  },
  creatorName: {
    type: String,
    required: true
  },
  attendees: [{
    type: String,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Session', sessionSchema);
