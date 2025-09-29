const express = require('express');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Scan QR code and record visit
router.post('/scan', authenticateAdmin, async (req, res) => {
  try {
    const { qrCode } = req.body;
    const db = req.app.locals.db;

    // Find user by QR code
    const result = await db.query(
      'SELECT * FROM users WHERE qr_code = $1',
      [qrCode]
    );
    const users = result.rows;

    if (users.length === 0) {
      return res.status(404).json({ error: 'Invalid QR code' });
    }

    const user = users[0];
    let isFreeVisit = false;

    // Check if user has available free visits
    const availableFreeVisits = user.free_visits_earned - user.free_visits_used;
    
    if (availableFreeVisits > 0) {
      // Ask admin if they want to use free visit
      return res.json({
        user: {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          totalVisits: user.total_visits,
          availableFreeVisits
        },
        hasFreeVisit: true,
        message: 'User has free visits available. Use free visit?'
      });
    }

    // Record regular visit
    await db.query('BEGIN');

    // Insert visit record
    await db.query(
      'INSERT INTO visits (user_id, is_free_visit, scanned_by) VALUES ($1, $2, $3)',
      [user.id, isFreeVisit, req.admin.id]
    );

    // Update user visit count
    const newTotalVisits = user.total_visits + 1;
    const newFreeVisitsEarned = Math.floor(newTotalVisits / 5);

    await db.query(
      'UPDATE users SET total_visits = $1, free_visits_earned = $2 WHERE id = $3',
      [newTotalVisits, newFreeVisitsEarned, user.id]
    );

    await db.query('COMMIT');

    res.json({
      success: true,
      message: 'Visit recorded successfully',
      user: {
        name: `${user.first_name} ${user.last_name}`,
        totalVisits: newTotalVisits,
        freeVisitsEarned: newFreeVisitsEarned,
        nextFreeVisitIn: 5 - (newTotalVisits % 5)
      }
    });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Scan error:', error);
    res.status(500).json({ error: 'Failed to record visit' });
  }
});

// Confirm free visit usage
router.post('/scan/free', authenticateAdmin, async (req, res) => {
  try {
    const { qrCode, useFreeVisit } = req.body;
    const db = req.app.locals.db;

    const result = await db.query(
      'SELECT * FROM users WHERE qr_code = $1',
      [qrCode]
    );
    const users = result.rows;

    if (users.length === 0) {
      return res.status(404).json({ error: 'Invalid QR code' });
    }

    const user = users[0];
    const isFreeVisit = useFreeVisit === true;

    await db.query('BEGIN');

    // Insert visit record
    await db.query(
      'INSERT INTO visits (user_id, is_free_visit, scanned_by) VALUES ($1, $2, $3)',
      [user.id, isFreeVisit, req.admin.id]
    );

    let newTotalVisits = user.total_visits;
    let newFreeVisitsEarned = user.free_visits_earned;
    let newFreeVisitsUsed = user.free_visits_used;

    if (isFreeVisit) {
      // Use free visit
      newFreeVisitsUsed += 1;
    } else {
      // Regular visit
      newTotalVisits += 1;
      newFreeVisitsEarned = Math.floor(newTotalVisits / 5);
    }

    await db.query(
      'UPDATE users SET total_visits = $1, free_visits_earned = $2, free_visits_used = $3 WHERE id = $4',
      [newTotalVisits, newFreeVisitsEarned, newFreeVisitsUsed, user.id]
    );

    await db.query('COMMIT');

    res.json({
      success: true,
      message: isFreeVisit ? 'Free visit used successfully' : 'Visit recorded successfully',
      user: {
        name: `${user.first_name} ${user.last_name}`,
        totalVisits: newTotalVisits,
        freeVisitsEarned: newFreeVisitsEarned,
        availableFreeVisits: newFreeVisitsEarned - newFreeVisitsUsed,
        nextFreeVisitIn: isFreeVisit ? null : 5 - (newTotalVisits % 5)
      }
    });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Free visit error:', error);
    res.status(500).json({ error: 'Failed to process visit' });
  }
});

// Get dashboard stats
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    const db = req.app.locals.db;

    // Get total users
    const totalUsersResult = await db.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = totalUsersResult.rows;
    
    // Get today's visits
    const todayVisitsResult = await db.query(
      'SELECT COUNT(*) as count FROM visits WHERE DATE(visit_date) = CURRENT_DATE'
    );
    const todayVisits = todayVisitsResult.rows;
    
    // Get this month's visits
    const monthVisitsResult = await db.query(
      'SELECT COUNT(*) as count FROM visits WHERE EXTRACT(MONTH FROM visit_date) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM visit_date) = EXTRACT(YEAR FROM CURRENT_DATE)'
    );
    const monthVisits = monthVisitsResult.rows;

    // Get recent visits
    const recentVisitsResult = await db.query(`
      SELECT v.visit_date, v.is_free_visit, u.first_name, u.last_name 
      FROM visits v 
      JOIN users u ON v.user_id = u.id 
      ORDER BY v.visit_date DESC 
      LIMIT 10
    `);
    const recentVisits = recentVisitsResult.rows;

    res.json({
      totalUsers: totalUsers[0].count,
      todayVisits: todayVisits[0].count,
      monthVisits: monthVisits[0].count,
      recentVisits
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard data' });
  }
});

module.exports = router;