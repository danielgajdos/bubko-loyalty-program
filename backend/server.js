const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database connection
let dbConfig;

if (process.env.DATABASE_URL) {
  // Use DATABASE_URL if available (Railway)
  dbConfig = process.env.DATABASE_URL;
} else {
  // Use individual environment variables
  dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
}

const pool = mysql.createPool(dbConfig);

// Make database available to routes
app.locals.db = pool;

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bubko Loyalty API is running' });
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
  console.log(`🎈 Bubko Loyalty API running on port ${PORT}`);
});