const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const User = require('../models/User');

// Get all sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ dateTime: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get session by ID
router.get('/:sessionId', async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get sessions by creator
router.get('/creator/:creatorId', async (req, res) => {
  try {
    const sessions = await Session.find({ creatorId: req.params.creatorId });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create session
router.post('/', async (req, res) => {
  try {
    const session = new Session(req.body);
    const newSession = await session.save();
    
    // Increment sessions created for user
    await User.findOneAndUpdate(
      { userId: req.body.creatorId },
      { $inc: { sessionsCreated: 1 } }
    );
    
    res.status(201).json(newSession);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update session status
router.patch('/:sessionId/status', async (req, res) => {
  try {
    const session = await Session.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      { status: req.body.status },
      { new: true }
    );
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add attendee to session
router.post('/:sessionId/attendees', async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId });
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    if (session.attendees.includes(req.body.userId)) {
      return res.status(400).json({ message: 'Already attending this session' });
    }
    
    session.attendees.push(req.body.userId);
    await session.save();
    
    // Increment sessions attended for user
    await User.findOneAndUpdate(
      { userId: req.body.userId },
      { $inc: { sessionsAttended: 1 } }
    );
    
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Filter sessions
router.post('/filter', async (req, res) => {
  try {
    const { topic, skillLevel, location, status } = req.body;
    let query = {};
    
    if (topic) query.topic = new RegExp(topic, 'i');
    if (skillLevel) query.skillLevel = skillLevel;
    if (location) query.location = new RegExp(location, 'i');
    if (status) query.status = status;
    
    const sessions = await Session.find(query).sort({ dateTime: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
