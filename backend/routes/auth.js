const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    const db = req.app.locals.db;

    // Check if user exists
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Generate unique QR code
    const qrCode = uuidv4();

    // Insert user
    const [result] = await db.execute(
      'INSERT INTO users (email, password_hash, first_name, last_name, phone, qr_code) VALUES (?, ?, ?, ?, ?, ?)',
      [email, passwordHash, firstName, lastName, phone, qrCode]
    );

    // Generate QR code image
    const qrCodeDataURL = await QRCode.toDataURL(qrCode);

    // Generate JWT token
    const token = jwt.sign(
      { id: result.insertId, email, type: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: result.insertId,
        email,
        firstName,
        lastName,
        qrCode: qrCodeDataURL,
        qrCodeText: qrCode
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = req.app.locals.db;

    // Find user
    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate QR code image
    const qrCodeDataURL = await QRCode.toDataURL(user.qr_code);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, type: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        totalVisits: user.total_visits,
        freeVisitsEarned: user.free_visits_earned,
        freeVisitsUsed: user.free_visits_used,
        qrCode: qrCodeDataURL,
        qrCodeText: user.qr_code
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Admin login
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = req.app.locals.db;

    // Find admin
    const [admins] = await db.execute(
      'SELECT * FROM admin_users WHERE username = ?',
      [username]
    );

    if (admins.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = admins[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, username: admin.username, type: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      message: 'Admin login successful',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Admin login failed' });
  }
});

module.exports = router;