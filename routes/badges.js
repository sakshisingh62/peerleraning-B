const express = require('express');
const router = express.Router();
const Badge = require('../models/Badge');
const User = require('../models/User');

// Get all badges for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const badges = await Badge.find({ userId: req.params.userId })
      .sort({ earnedAt: -1 });
    res.json(badges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get badge by ID
router.get('/:badgeId', async (req, res) => {
  try {
    const badge = await Badge.findOne({ badgeId: req.params.badgeId });
    if (!badge) {
      return res.status(404).json({ message: 'Badge not found' });
    }
    res.json(badge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create/Award badge
router.post('/', async (req, res) => {
  try {
    // Check if user already has this badge type
    const existingBadge = await Badge.findOne({
      userId: req.body.userId,
      badgeType: req.body.badgeType
    });

    if (existingBadge) {
      return res.status(400).json({ 
        message: 'User already has this badge type',
        badge: existingBadge
      });
    }

    // Create new badge
    const badge = new Badge(req.body);
    const newBadge = await badge.save();
    
    // Update user's badges array
    await User.findOneAndUpdate(
      { userId: req.body.userId },
      { $addToSet: { badges: req.body.badgeName } }
    );
    
    res.status(201).json(newBadge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all badges (for admin)
router.get('/', async (req, res) => {
  try {
    const badges = await Badge.find().sort({ earnedAt: -1 });
    res.json(badges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete badge
router.delete('/:badgeId', async (req, res) => {
  try {
    const badge = await Badge.findOneAndDelete({ 
      badgeId: req.params.badgeId 
    });
    
    if (!badge) {
      return res.status(404).json({ message: 'Badge not found' });
    }
    
    // Remove from user's badges array
    await User.findOneAndUpdate(
      { userId: badge.userId },
      { $pull: { badges: badge.badgeName } }
    );
    
    res.json({ message: 'Badge deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get badge statistics
router.get('/user/:userId/stats', async (req, res) => {
  try {
    const badges = await Badge.find({ userId: req.params.userId });
    
    const stats = {
      total: badges.length,
      byType: {},
      recentBadges: badges.slice(0, 5)
    };
    
    badges.forEach(badge => {
      stats.byType[badge.badgeType] = (stats.byType[badge.badgeType] || 0) + 1;
    });
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
