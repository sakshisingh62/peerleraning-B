const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    ref: 'Session'
  },
  studentId: {
    type: String,
    required: true,
    ref: 'User'
  },
  feedbackId: {
    type: String,
    required: false
  },
  studentName: {
    type: String,
    required: false
  },
  learned: {
    type: String,
    required: false,
    default: ''
  },
  behavior: {
    type: String,
    enum: ['Good', 'Neutral', 'Bad'],
    default: 'Good'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Feedback', feedbackSchema);
