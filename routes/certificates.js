const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const User = require('../models/User');

// Get all certificates for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.params.userId })
      .sort({ issueDate: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get certificate by ID
router.get('/:certificateId', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.certificateId });
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create certificate
router.post('/', async (req, res) => {
  try {
    // Check if certificate already exists for this session and user
    const existingCert = await Certificate.findOne({
      userId: req.body.userId,
      sessionId: req.body.sessionId,
      certificateType: req.body.certificateType
    });

    if (existingCert) {
      return res.status(400).json({ 
        message: 'Certificate already exists for this session',
        certificate: existingCert
      });
    }

    // Create new certificate
    const certificate = new Certificate(req.body);
    const newCertificate = await certificate.save();
    
    res.status(201).json(newCertificate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all certificates (for admin)
router.get('/', async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ issueDate: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete certificate
router.delete('/:certificateId', async (req, res) => {
  try {
    const certificate = await Certificate.findOneAndDelete({ 
      certificateId: req.params.certificateId 
    });
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    res.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get certificate statistics for a user
router.get('/user/:userId/stats', async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.params.userId });
    
    const stats = {
      total: certificates.length,
      byType: {
        'peer-mentor': certificates.filter(c => c.certificateType === 'peer-mentor').length,
        'outstanding-helper': certificates.filter(c => c.certificateType === 'outstanding-helper').length,
        'completion': certificates.filter(c => c.certificateType === 'completion').length
      },
      averageRating: certificates.length > 0
        ? certificates.reduce((sum, c) => sum + (c.averageRating || 0), 0) / certificates.length
        : 0
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
