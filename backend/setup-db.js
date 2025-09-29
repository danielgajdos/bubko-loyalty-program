const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: 'centerbeam.proxy.rlwy.net',
    port: 38435,
    user: 'root',
    password: 'QUeHOxQDqDRKYJiXHmGIPqTjMVzPdzen',
    database: 'railway'
  });

  console.log('Connected to Railway MySQL database');

  // Create tables
  const createUsersTable = `
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
  `;

  const createAdminUsersTable = `
    CREATE TABLE IF NOT EXISTS admin_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      role ENUM('admin', 'staff') DEFAULT 'staff',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createVisitsTable = `
    CREATE TABLE IF NOT EXISTS visits (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      is_free_visit BOOLEAN DEFAULT FALSE,
      scanned_by INT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (scanned_by) REFERENCES admin_users(id)
    )
  `;

  try {
    await connection.execute(createUsersTable);
    console.log('✅ Users table created');

    await connection.execute(createAdminUsersTable);
    console.log('✅ Admin users table created');

    await connection.execute(createVisitsTable);
    console.log('✅ Visits table created');

    // Create default admin user
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    await connection.execute(
      'INSERT IGNORE INTO admin_users (username, password_hash, email, role) VALUES (?, ?, ?, ?)',
      ['admin', adminPasswordHash, 'admin@bubko.sk', 'admin']
    );
    console.log('✅ Default admin user created');

    console.log('🎉 Database setup complete!');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    await connection.end();
  }
}

setupDatabase();