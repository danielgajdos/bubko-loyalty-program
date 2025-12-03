const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit');
const { authenticateToken, authenticateAdmin } = require('../middleware/auth');

// Get user's visit history
router.get('/my-visits', authenticateToken, async (req, res) => {
  try {
    const visits = await Visit.getUserVisits(req.user.id);
    res.json(visits);
  } catch (error) {
    console.error('Error fetching visits:', error);
    res.status(500).json({ error: 'Failed to fetch visits' });
  }
});

// Get specific visit details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const visit = await Visit.getById(req.params.id);
    
    if (!visit) {
      return res.status(404).json({ error: 'Visit not found' });
    }
    
    // Check if user owns this visit or is admin
    if (visit.user_id !== req.user.id && req.user.type !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(visit);
  } catch (error) {
    console.error('Error fetching visit:', error);
    res.status(500).json({ error: 'Failed to fetch visit' });
  }
});

// Admin: Create visit (scan QR and add products)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { userId, qrCode, products, notes } = req.body;
    
    if (!products || products.length === 0) {
      return res.status(400).json({ error: 'At least one product is required' });
    }
    
    // Find user by ID or QR code
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else if (qrCode) {
      user = await User.findByQRCode(qrCode);
    } else {
      return res.status(400).json({ error: 'User ID or QR code is required' });
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Create visit with products
    const visitId = await Visit.create(user.id, products, req.user.id, notes);
    const visit = await Visit.getById(visitId);
    
    res.status(201).json({
      message: 'Visit recorded successfully',
      visit
    });
  } catch (error) {
    console.error('Error creating visit:', error);
    res.status(500).json({ error: error.message || 'Failed to create visit' });
  }
});

// Admin: Get all visits
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const visits = await Visit.getAll(limit, offset);
    res.json(visits);
  } catch (error) {
    console.error('Error fetching visits:', error);
    res.status(500).json({ error: 'Failed to fetch visits' });
  }
});

// Admin: Get visit statistics
router.get('/stats/summary', authenticateAdmin, async (req, res) => {
  try {
    const stats = await Visit.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
