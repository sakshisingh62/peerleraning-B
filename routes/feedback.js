const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// Get all feedback for a session
router.get('/session/:sessionId', async (req, res) => {
  try {
    const feedback = await Feedback.find({ sessionId: req.params.sessionId });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get feedback by student
router.get('/student/:studentId', async (req, res) => {
  try {
    const feedback = await Feedback.find({ studentId: req.params.studentId });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create feedback
router.post('/', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    const newFeedback = await feedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
