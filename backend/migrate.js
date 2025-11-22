const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {
  console.log('🚀 Starting database migration...\n');

  const dbConfig = {
    host: process.env.DB_HOST || 'mysql.railway.internal',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'railway',
    multipleStatements: true
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

    // Check if columns already exist
    console.log('🔍 Checking existing schema...');
    
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'
    `, [dbConfig.database]);
    
    const existingColumns = columns.map(c => c.COLUMN_NAME);
    console.log('Existing columns:', existingColumns.join(', '));

    // Add barcode column if it doesn't exist
    if (!existingColumns.includes('barcode')) {
      console.log('\n📝 Adding barcode column...');
      await connection.execute(`
        ALTER TABLE users 
        ADD COLUMN barcode VARCHAR(255) UNIQUE AFTER qr_code
      `);
      console.log('✅ Added barcode column');
    } else {
      console.log('⏭️  barcode column already exists');
    }

    // Add one_child columns if they don't exist
    if (!existingColumns.includes('one_child_visits')) {
      console.log('\n📝 Adding one_child tracking columns...');
      await connection.execute(`
        ALTER TABLE users 
        ADD COLUMN one_child_visits INT DEFAULT 0 AFTER barcode,
        ADD COLUMN one_child_free_earned INT DEFAULT 0 AFTER one_child_visits,
        ADD COLUMN one_child_free_used INT DEFAULT 0 AFTER one_child_free_earned
      `);
      console.log('✅ Added one_child columns');
    } else {
      console.log('⏭️  one_child columns already exist');
    }

    // Add two_kids columns if they don't exist
    if (!existingColumns.includes('two_kids_visits')) {
      console.log('\n📝 Adding two_kids tracking columns...');
      await connection.execute(`
        ALTER TABLE users 
        ADD COLUMN two_kids_visits INT DEFAULT 0 AFTER one_child_free_used,
        ADD COLUMN two_kids_free_earned INT DEFAULT 0 AFTER two_kids_visits,
        ADD COLUMN two_kids_free_used INT DEFAULT 0 AFTER two_kids_free_earned
      `);
      console.log('✅ Added two_kids columns');
    } else {
      console.log('⏭️  two_kids columns already exist');
    }

    // Check visits table
    console.log('\n🔍 Checking visits table schema...');
    const [visitColumns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'visits'
    `, [dbConfig.database]);
    
    const existingVisitColumns = visitColumns.map(c => c.COLUMN_NAME);

    // Add product_type column if it doesn't exist
    if (!existingVisitColumns.includes('product_type')) {
      console.log('\n📝 Adding product_type column to visits...');
      await connection.execute(`
        ALTER TABLE visits 
        ADD COLUMN product_type ENUM('one_child', 'two_kids') NOT NULL DEFAULT 'one_child' AFTER visit_date
      `);
      console.log('✅ Added product_type column');
    } else {
      console.log('⏭️  product_type column already exists');
    }

    // Add notes column if it doesn't exist
    if (!existingVisitColumns.includes('notes')) {
      console.log('\n📝 Adding notes column to visits...');
      await connection.execute(`
        ALTER TABLE visits 
        ADD COLUMN notes TEXT AFTER scanned_by
      `);
      console.log('✅ Added notes column');
    } else {
      console.log('⏭️  notes column already exists');
    }

    // Migrate existing data
    console.log('\n📊 Migrating existing data...');
    
    // Check if migration is needed
    const [needsMigration] = await connection.execute(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE total_visits > 0 AND one_child_visits = 0
    `);

    if (needsMigration[0].count > 0) {
      console.log(`Found ${needsMigration[0].count} users to migrate`);
      
      await connection.execute(`
        UPDATE users 
        SET one_child_visits = total_visits,
            one_child_free_earned = free_visits_earned,
            one_child_free_used = free_visits_used,
            barcode = qr_code
        WHERE total_visits > 0 AND one_child_visits = 0
      `);
      
      console.log('✅ Migrated existing user data');
    } else {
      console.log('⏭️  No data migration needed');
    }

    // Verify migration
    console.log('\n🔍 Verifying migration...');
    const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const [visitCount] = await connection.execute('SELECT COUNT(*) as count FROM visits');
    
    console.log(`\n📊 Database Statistics:`);
    console.log(`   Users: ${userCount[0].count}`);
    console.log(`   Visits: ${visitCount[0].count}`);

    console.log('\n✅ Migration completed successfully! 🎉\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run migration
runMigration().catch(console.error);
