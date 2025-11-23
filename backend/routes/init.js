const express = require('express');
const router = express.Router();

// One-time database initialization endpoint
// This should be called once and then disabled
router.post('/initialize-database', async (req, res) => {
  try {
    const db = req.app.locals.db;
    
    console.log('🚀 Starting database initialization...');

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
        barcode VARCHAR(255) UNIQUE,
        one_child_visits INT DEFAULT 0,
        one_child_free_earned INT DEFAULT 0,
        one_child_free_used INT DEFAULT 0,
        two_kids_visits INT DEFAULT 0,
        two_kids_free_earned INT DEFAULT 0,
        two_kids_free_used INT DEFAULT 0,
        total_visits INT DEFAULT 0,
        free_visits_earned INT DEFAULT 0,
        free_visits_used INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

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
    console.log('✅ Admin_users table created');

    // Create visits table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS visits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        product_type ENUM('one_child', 'two_kids') NOT NULL DEFAULT 'one_child',
        is_free_visit BOOLEAN DEFAULT FALSE,
        scanned_by INT,
        notes TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (scanned_by) REFERENCES admin_users(id)
      )
    `);
    console.log('✅ Visits table created');

    // Insert default admin user
    await db.execute(`
      INSERT INTO admin_users (username, password_hash, email, role) 
      VALUES ('admin', '$2b$10$rQZ8kqH5jF9yGzJ3mK7L8eX9vN2wP4tR6sA1bC3dE5fG7hI9jK0lM', 'admin@bubko.sk', 'admin')
      ON DUPLICATE KEY UPDATE username=username
    `);
    console.log('✅ Admin user created');

    // Get counts
    const [adminCount] = await db.execute('SELECT COUNT(*) as count FROM admin_users');
    const [userCount] = await db.execute('SELECT COUNT(*) as count FROM users');
    const [visitCount] = await db.execute('SELECT COUNT(*) as count FROM visits');

    res.json({
      success: true,
      message: 'Database initialized successfully!',
      tables: {
        admin_users: adminCount[0].count,
        users: userCount[0].count,
        visits: visitCount[0].count
      },
      credentials: {
        username: 'admin',
        password: 'admin123'
      },
      note: 'This endpoint should now be disabled for security'
    });

  } catch (error) {
    console.error('Initialization error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize database',
      details: error.message
    });
  }
});

module.exports = router;
