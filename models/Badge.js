const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  badgeId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  badgeName: {
    type: String,
    required: true
  },
  badgeType: {
    type: String,
    required: true,
    enum: [
      'peer-mentor',
      'excellent-teacher',
      'knowledge-sharer',
      'rising-star',
      'consistent-learner',
      'feedback-master',
      'session-champion',
      'community-builder'
    ]
  },
  description: {
    type: String,
    default: ''
  },
  earnedAt: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for efficient queries
badgeSchema.index({ userId: 1, earnedAt: -1 });

module.exports = mongoose.model('Badge', badgeSchema);
