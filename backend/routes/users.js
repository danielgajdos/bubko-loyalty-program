const express = require('express');
const QRCode = require('qrcode');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    
    const [users] = await db.execute(
      'SELECT id, email, first_name, last_name, phone, total_visits, free_visits_earned, free_visits_used, qr_code FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    const qrCodeDataURL = await QRCode.toDataURL(user.qr_code);

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      totalVisits: user.total_visits,
      freeVisitsEarned: user.free_visits_earned,
      freeVisitsUsed: user.free_visits_used,
      availableFreeVisits: user.free_visits_earned - user.free_visits_used,
      qrCode: qrCodeDataURL,
      qrCodeText: user.qr_code
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Get user visit history
router.get('/visits', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    
    const [visits] = await db.execute(
      'SELECT visit_date, is_free_visit FROM visits WHERE user_id = ? ORDER BY visit_date DESC',
      [req.user.id]
    );

    res.json(visits);
  } catch (error) {
    console.error('Visits error:', error);
    res.status(500).json({ error: 'Failed to get visits' });
  }
});

module.exports = router;