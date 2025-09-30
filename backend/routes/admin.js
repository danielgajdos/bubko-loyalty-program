const express = require('express');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Scan QR code and record visit
router.post('/scan', authenticateAdmin, async (req, res) => {
  try {
    const { qrCode } = req.body;
    const db = req.app.locals.db;

    // Find user by QR code
    const [users] = await db.execute(
      'SELECT * FROM users WHERE qr_code = ?',
      [qrCode]
    );

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
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Insert visit record
      await connection.execute(
        'INSERT INTO visits (user_id, is_free_visit, scanned_by) VALUES (?, ?, ?)',
        [user.id, isFreeVisit, req.admin.id]
      );

      // Update user visit count
      const newTotalVisits = user.total_visits + 1;
      const newFreeVisitsEarned = Math.floor(newTotalVisits / 5);

      await connection.execute(
        'UPDATE users SET total_visits = ?, free_visits_earned = ? WHERE id = ?',
        [newTotalVisits, newFreeVisitsEarned, user.id]
      );

      await connection.commit();
      connection.release();

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
    } catch (transactionError) {
      await connection.rollback();
      connection.release();
      throw transactionError;
    }
  } catch (error) {
    console.error('Scan error:', error);
    console.error('Admin ID:', req.admin?.id);
    console.error('User ID:', req.body?.qrCode);
    res.status(500).json({ 
      error: 'Failed to record visit',
      details: error.message,
      adminId: req.admin?.id
    });
  }
});

// Confirm free visit usage
router.post('/scan/free', authenticateAdmin, async (req, res) => {
  try {
    const { qrCode, useFreeVisit } = req.body;
    const db = req.app.locals.db;

    const [users] = await db.execute(
      'SELECT * FROM users WHERE qr_code = ?',
      [qrCode]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Invalid QR code' });
    }

    const user = users[0];
    const isFreeVisit = useFreeVisit === true;

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Insert visit record
      await connection.execute(
        'INSERT INTO visits (user_id, is_free_visit, scanned_by) VALUES (?, ?, ?)',
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

      await connection.execute(
        'UPDATE users SET total_visits = ?, free_visits_earned = ?, free_visits_used = ? WHERE id = ?',
        [newTotalVisits, newFreeVisitsEarned, newFreeVisitsUsed, user.id]
      );

      await connection.commit();
      connection.release();

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
    } catch (transactionError) {
      await connection.rollback();
      connection.release();
      throw transactionError;
    }
  } catch (error) {
    console.error('Free visit error:', error);
    console.error('Admin ID:', req.admin?.id);
    res.status(500).json({ 
      error: 'Failed to process visit',
      details: error.message,
      adminId: req.admin?.id
    });
  }
});

// Get dashboard stats
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    const db = req.app.locals.db;

    // Get total users
    const [totalUsers] = await db.execute('SELECT COUNT(*) as count FROM users');
    
    // Get today's visits
    const [todayVisits] = await db.execute(
      'SELECT COUNT(*) as count FROM visits WHERE DATE(visit_date) = CURDATE()'
    );
    
    // Get this month's visits
    const [monthVisits] = await db.execute(
      'SELECT COUNT(*) as count FROM visits WHERE MONTH(visit_date) = MONTH(CURDATE()) AND YEAR(visit_date) = YEAR(CURDATE())'
    );

    // Get recent visits
    const [recentVisits] = await db.execute(`
      SELECT v.visit_date, v.is_free_visit, u.first_name, u.last_name 
      FROM visits v 
      JOIN users u ON v.user_id = u.id 
      ORDER BY v.visit_date DESC 
      LIMIT 10
    `);

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