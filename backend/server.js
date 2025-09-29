const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

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

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

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

// Debug endpoint to check user data
app.get('/api/debug/users', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const result = await db.query('SELECT id, email, qr_code FROM users LIMIT 5');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Database setup endpoint
app.post('/api/setup-db', async (req, res) => {
  try {
    const db = req.app.locals.db;
    
    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create admin_users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        role VARCHAR(10) DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create visits table
    await db.query(`
      CREATE TABLE IF NOT EXISTS visits (
        id SERIAL PRIMARY KEY,
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
    await db.query(
      'INSERT INTO admin_users (username, password_hash, email, role) VALUES ($1, $2, $3, $4) ON CONFLICT (username) DO NOTHING',
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