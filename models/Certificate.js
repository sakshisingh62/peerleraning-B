const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  studentName: {
    type: String,
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  sessionTitle: {
    type: String,
    required: true
  },
  certificateType: {
    type: String,
    required: true,
    enum: ['peer-mentor', 'outstanding-helper', 'completion']
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  averageRating: {
    type: Number,
    default: 0
  },
  totalAttendees: {
    type: Number,
    default: 0
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for efficient queries
certificateSchema.index({ userId: 1, issueDate: -1 });

module.exports = mongoose.model('Certificate', certificateSchema);
