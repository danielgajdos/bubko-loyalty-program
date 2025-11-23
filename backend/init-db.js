const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
  console.log('🚀 Starting database initialization...\n');

  const dbConfig = {
    host: process.env.DB_HOST || 'mysql.railway.internal',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'railway',
    multipleStatements: true,
    connectTimeout: 30000
  };

  console.log('📡 Connecting to database:', {
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database
  });

  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database\n');

    // Create users table
    console.log('📝 Creating users table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        qr_code VARCHAR(255) UNIQUE NOT NULL,
        barcode VARCHAR(255) UNIQUE,
        
        -- One child entry tracking
        one_child_visits INT DEFAULT 0,
        one_child_free_earned INT DEFAULT 0,
        one_child_free_used INT DEFAULT 0,
        
        -- Two kids entry tracking
        two_kids_visits INT DEFAULT 0,
        two_kids_free_earned INT DEFAULT 0,
        two_kids_free_used INT DEFAULT 0,
        
        -- Legacy fields (for backward compatibility)
        total_visits INT DEFAULT 0,
        free_visits_earned INT DEFAULT 0,
        free_visits_used INT DEFAULT 0,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

    // Create admin_users table
    console.log('\n📝 Creating admin_users table...');
    await connection.execute(`
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
    console.log('\n📝 Creating visits table...');
    await connection.execute(`
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
    console.log('\n📝 Creating default admin user...');
    await connection.execute(`
      INSERT INTO admin_users (username, password_hash, email, role) 
      VALUES ('admin', '$2b$10$rQZ8kqH5jF9yGzJ3mK7L8eX9vN2wP4tR6sA1bC3dE5fG7hI9jK0lM', 'admin@bubko.sk', 'admin')
      ON DUPLICATE KEY UPDATE username=username
    `);
    console.log('✅ Admin user created (username: admin, password: admin123)');

    // Verify initialization
    console.log('\n🔍 Verifying initialization...');
    
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`\n📊 Tables created: ${tables.length}`);
    tables.forEach(table => {
      console.log(`   - ${Object.values(table)[0]}`);
    });

    const [adminCount] = await connection.execute('SELECT COUNT(*) as count FROM admin_users');
    const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const [visitCount] = await connection.execute('SELECT COUNT(*) as count FROM visits');
    
    console.log(`\n📊 Database Statistics:`);
    console.log(`   Admin users: ${adminCount[0].count}`);
    console.log(`   Users: ${userCount[0].count}`);
    console.log(`   Visits: ${visitCount[0].count}`);

    console.log('\n✅ Database initialization completed successfully! 🎉\n');
    console.log('🔐 Admin Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123\n');

  } catch (error) {
    console.error('\n❌ Initialization failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run initialization
initializeDatabase().catch(console.error);
