const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const { authenticateAdmin } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://frontend-8ywntxqs6-bubkos-projects.vercel.app',
    'https://frontend-gupk852ce-bubkos-projects.vercel.app',
    /.*\.vercel\.app$/
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Database connection - explicitly use MySQL
const dbConfig = {
  host: process.env.DB_HOST || 'mysql.railway.internal',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'railway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

console.log('🔗 Connecting to MySQL:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database
});

const pool = mysql.createPool(dbConfig);

// Make database available to routes
app.locals.db = pool;

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bubko Loyalty API is running', timestamp: new Date().toISOString() });
});

// Debug endpoint to check user data
app.get('/api/debug/users', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const [rows] = await db.execute('SELECT id, email, qr_code FROM users LIMIT 5');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test QR code endpoint
app.get('/api/test-qr/:qrCode', async (req, res) => {
  try {
    const { qrCode } = req.params;
    const db = req.app.locals.db;
    const [rows] = await db.execute('SELECT id, email, first_name, last_name, qr_code FROM users WHERE qr_code = ?', [qrCode]);
    if (rows.length > 0) {
      res.json({ found: true, user: rows[0] });
    } else {
      res.json({ found: false, message: 'QR code not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simple scan test endpoint (no auth required)
app.post('/api/test-scan', async (req, res) => {
  try {
    const { qrCode } = req.body;
    const db = req.app.locals.db;

    console.log('Testing scan for QR code:', qrCode);

    const [users] = await db.execute(
      'SELECT * FROM users WHERE qr_code = ?',
      [qrCode]
    );

    console.log('Found users:', users.length);

    if (users.length === 0) {
      return res.status(404).json({ error: 'Invalid QR code' });
    }

    const user = users[0];
    res.json({
      success: true,
      message: 'QR code found!',
      user: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        totalVisits: user.total_visits
      }
    });
  } catch (error) {
    console.error('Test scan error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint to check all QR codes in database
app.get('/api/debug/qr-codes', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const [users] = await db.execute('SELECT id, email, first_name, last_name, qr_code FROM users');
    
    res.json({
      totalUsers: users.length,
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        qrCode: user.qr_code,
        qrCodeLength: user.qr_code ? user.qr_code.length : 0
      }))
    });
  } catch (error) {
    console.error('Debug QR codes error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint to check admin token info
app.get('/api/debug/admin-info', authenticateAdmin, async (req, res) => {
  try {
    res.json({
      adminInfo: req.admin,
      adminId: req.admin.id,
      adminType: req.admin.type,
      adminUsername: req.admin.username
    });
  } catch (error) {
    console.error('Debug admin info error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Database setup endpoint
app.post('/api/setup-db', async (req, res) => {
  try {
    const db = req.app.locals.db;

    // Create users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        qr_code VARCHAR(255) UNIQUE NOT NULL,
        total_visits INT DEFAULT 0,
        free_visits_earned INT DEFAULT 0,
        free_visits_used INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create admin_users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        role ENUM('admin', 'staff') DEFAULT 'staff',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create visits table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS visits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_free_visit BOOLEAN DEFAULT FALSE,
        scanned_by INT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (scanned_by) REFERENCES admin_users(id)
      )
    `);

    // Create default admin user
    const bcrypt = require('bcrypt');
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    await db.execute(
      'INSERT IGNORE INTO admin_users (username, password_hash, email, role) VALUES (?, ?, ?, ?)',
      ['admin', adminPasswordHash, 'admin@bubko.sk', 'admin']
    );

    // Create test user with your specific QR code
    const testPasswordHash = await bcrypt.hash('test123', 10);
    await db.execute(
      'INSERT IGNORE INTO users (email, password_hash, first_name, last_name, phone, qr_code) VALUES (?, ?, ?, ?, ?, ?)',
      ['test@bubko.sk', testPasswordHash, 'Test', 'User', '+421123456789', 'f2093c74-2707-41d3-867c-cb00ed00f699']
    );

    res.json({
      success: true,
      message: 'Database setup completed successfully!'
    });
  } catch (error) {
    console.error('Database setup error:', error);
    res.status(500).json({
      success: false,
      error: 'Database setup failed',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🎈 Bubko Loyalty API running on port ${PORT} - MySQL ready`);
});