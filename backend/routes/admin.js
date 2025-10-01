const express = require('express');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Scan QR code and record visit
router.post('/scan', authenticateAdmin, async (req, res) => {
  try {
    const { qrCode } = req.body;
    const db = req.app.locals.db;

    // Find user by QR code or barcode
    const [users] = await db.execute(
      'SELECT * FROM users WHERE qr_code = ? OR barcode = ?',
      [qrCode, qrCode]
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

    // Record regular visit - use raw SQL as workaround for MySQL issue
    // Insert visit record using string interpolation (temporary workaround)
    await db.execute(
      `INSERT INTO visits (user_id, is_free_visit) VALUES (${user.id}, ${isFreeVisit ? 1 : 0})`
    );

    // Update user visit count
    const newTotalVisits = user.total_visits + 1;
    const newFreeVisitsEarned = Math.floor(newTotalVisits / 5);

    await db.execute(
      `UPDATE users SET total_visits = ${newTotalVisits}, free_visits_earned = ${newFreeVisitsEarned} WHERE id = ${user.id}`
    );

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
      'SELECT * FROM users WHERE qr_code = ? OR barcode = ?',
      [qrCode, qrCode]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Invalid QR code' });
    }

    const user = users[0];
    const isFreeVisit = useFreeVisit === true;

    // Insert visit record
    await db.execute(
      `INSERT INTO visits (user_id, is_free_visit) VALUES (${user.id}, ${isFreeVisit ? 1 : 0})`
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

    await db.execute(
      `UPDATE users SET total_visits = ${newTotalVisits}, free_visits_earned = ${newFreeVisitsEarned}, free_visits_used = ${newFreeVisitsUsed} WHERE id = ${user.id}`
    );

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

// 1. Get all registered users with visit details
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const db = req.app.locals.db;

    // Get all users with their visit statistics
    const [users] = await db.execute(`
      SELECT 
        id, 
        email, 
        first_name, 
        last_name, 
        phone, 
        qr_code, 
        barcode,
        total_visits, 
        free_visits_earned, 
        free_visits_used,
        (free_visits_earned - free_visits_used) as available_free_visits,
        created_at
      FROM users 
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      users: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// 2. Update user visit counts (edit functionality)
router.put('/users/:userId', authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { totalVisits, freeVisitsEarned, freeVisitsUsed } = req.body;
    const db = req.app.locals.db;

    // Update user visit counts
    await db.execute(
      `UPDATE users SET 
        total_visits = ${totalVisits}, 
        free_visits_earned = ${freeVisitsEarned}, 
        free_visits_used = ${freeVisitsUsed} 
      WHERE id = ${userId}`
    );

    // Get updated user data
    const [users] = await db.execute(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'User updated successfully',
      user: users[0]
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      error: 'Failed to update user',
      details: error.message 
    });
  }
});

// 3. Assign new QR code to existing user
router.put('/users/:userId/qr-code', authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { qrCode } = req.body;
    const db = req.app.locals.db;

    // Check if QR code is already in use
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE (qr_code = ? OR barcode = ?) AND id != ?',
      [qrCode, qrCode, userId]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        error: 'QR code already assigned to another user' 
      });
    }

    // Update user's QR code and barcode
    await db.execute(
      `UPDATE users SET qr_code = '${qrCode}', barcode = '${qrCode}' WHERE id = ${userId}`
    );

    // Get updated user data
    const [users] = await db.execute(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'QR code assigned successfully',
      user: users[0]
    });
  } catch (error) {
    console.error('Assign QR code error:', error);
    res.status(500).json({ 
      error: 'Failed to assign QR code',
      details: error.message 
    });
  }
});

// 4. Quick registration for offline users (admin creates account)
router.post('/quick-register', authenticateAdmin, async (req, res) => {
  try {
    const { firstName, lastName, qrCode, phone, email } = req.body;
    const db = req.app.locals.db;

    // Validate required fields
    if (!firstName || !lastName || !qrCode) {
      return res.status(400).json({ 
        error: 'First name, last name, and QR code are required' 
      });
    }

    // Check if QR code is already in use
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE qr_code = ? OR barcode = ?',
      [qrCode, qrCode]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        error: 'QR code already assigned to another user' 
      });
    }

    // Check if email is provided and not already in use
    if (email) {
      const [existingEmail] = await db.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingEmail.length > 0) {
        return res.status(400).json({ 
          error: 'Email already registered' 
        });
      }
    }

    // Generate a temporary password hash (user won't use it for login)
    const bcrypt = require('bcrypt');
    const tempPassword = Math.random().toString(36).substring(7);
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    // Create user account
    const [result] = await db.execute(
      `INSERT INTO users (
        email, 
        password_hash, 
        first_name, 
        last_name, 
        phone, 
        qr_code, 
        barcode,
        total_visits,
        free_visits_earned,
        free_visits_used
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 0)`,
      [
        email || `offline_${Date.now()}@bubko.sk`, // Generate email if not provided
        passwordHash,
        firstName,
        lastName,
        phone || null,
        qrCode,
        qrCode
      ]
    );

    // Get the created user
    const [users] = await db.execute(
      'SELECT * FROM users WHERE id = ?',
      [result.insertId]
    );

    res.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: users[0].id,
        firstName: users[0].first_name,
        lastName: users[0].last_name,
        email: users[0].email,
        phone: users[0].phone,
        qrCode: users[0].qr_code,
        barcode: users[0].barcode,
        totalVisits: users[0].total_visits,
        freeVisitsEarned: users[0].free_visits_earned,
        freeVisitsUsed: users[0].free_visits_used
      }
    });
  } catch (error) {
    console.error('Quick register error:', error);
    res.status(500).json({ 
      error: 'Failed to register user',
      details: error.message 
    });
  }
});

// 5. Delete user account
router.delete('/users/:userId', authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const db = req.app.locals.db;

    // Delete user (visits will be deleted automatically due to foreign key cascade)
    await db.execute(`DELETE FROM users WHERE id = ${userId}`);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      error: 'Failed to delete user',
      details: error.message 
    });
  }
});

module.exports = router;