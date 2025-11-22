# How to Run Database Migration on Railway

## ✅ Local Migration Complete
The migration has been successfully run on your local database!

## 🚂 Run Migration on Railway Production Database

### Option 1: Using Railway CLI (Recommended)

1. **Login to Railway**
   ```bash
   railway login
   ```

2. **Link to your project**
   ```bash
   cd bubko-loyalty/backend
   railway link
   ```
   Select your bubko-loyalty project

3. **Run the migration**
   ```bash
   railway run node migrate.js
   ```

This will automatically use Railway's environment variables and connect to the production database.

### Option 2: Using Railway Dashboard

1. **Get Database Credentials**
   - Go to https://railway.app
   - Open your bubko-loyalty project
   - Click on the MySQL service
   - Go to "Variables" tab
   - Copy these values:
     - `MYSQLHOST`
     - `MYSQLUSER`
     - `MYSQLPASSWORD`
     - `MYSQLDATABASE`

2. **Create Production .env**
   ```bash
   cd bubko-loyalty/backend
   cp .env .env.production
   ```

3. **Edit .env.production** with Railway credentials:
   ```env
   DB_HOST=your-railway-mysql-host
   DB_USER=your-railway-mysql-user
   DB_PASSWORD=your-railway-mysql-password
   DB_NAME=your-railway-database-name
   ```

4. **Run migration with production config**
   ```bash
   NODE_ENV=production node migrate.js
   ```
   
   Or manually:
   ```bash
   DB_HOST=your-host DB_USER=your-user DB_PASSWORD=your-pass DB_NAME=your-db node migrate.js
   ```

### Option 3: Using Railway MySQL Console

1. **Go to Railway Dashboard**
   - https://railway.app
   - Open your project
   - Click on MySQL service
   - Click "Data" tab
   - Click "Query" button

2. **Run these SQL commands one by one:**

```sql
-- Add barcode column
ALTER TABLE users 
ADD COLUMN barcode VARCHAR(255) UNIQUE AFTER qr_code;

-- Add one_child tracking columns
ALTER TABLE users 
ADD COLUMN one_child_visits INT DEFAULT 0 AFTER barcode,
ADD COLUMN one_child_free_earned INT DEFAULT 0 AFTER one_child_visits,
ADD COLUMN one_child_free_used INT DEFAULT 0 AFTER one_child_free_earned;

-- Add two_kids tracking columns
ALTER TABLE users 
ADD COLUMN two_kids_visits INT DEFAULT 0 AFTER one_child_free_used,
ADD COLUMN two_kids_free_earned INT DEFAULT 0 AFTER two_kids_visits,
ADD COLUMN two_kids_free_used INT DEFAULT 0 AFTER two_kids_free_earned;

-- Add product_type to visits
ALTER TABLE visits 
ADD COLUMN product_type ENUM('one_child', 'two_kids') NOT NULL DEFAULT 'one_child' AFTER visit_date;

-- Add notes to visits
ALTER TABLE visits 
ADD COLUMN notes TEXT AFTER scanned_by;

-- Migrate existing data
UPDATE users 
SET one_child_visits = total_visits,
    one_child_free_earned = free_visits_earned,
    one_child_free_used = free_visits_used,
    barcode = qr_code
WHERE total_visits > 0 AND one_child_visits = 0;

-- Verify migration
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_visits FROM visits;
```

## ✅ Verification

After running the migration, verify it worked:

1. **Check the backend logs**
   ```bash
   railway logs
   ```

2. **Test the API**
   ```bash
   curl https://perceptive-radiance-production.up.railway.app/api/health
   ```

3. **Test scanning with product types**
   - Go to admin scanner
   - Select "1 child" or "2 kids"
   - Scan a QR code
   - Verify it records correctly

## 🔍 Troubleshooting

### If you get "column already exists" error:
This is fine! It means the column was already added. The migration is idempotent.

### If you get connection errors:
- Check Railway MySQL service is running
- Verify database credentials
- Check if Railway MySQL is accessible

### If data doesn't migrate:
Run this query to manually migrate:
```sql
UPDATE users 
SET one_child_visits = total_visits,
    one_child_free_earned = free_visits_earned,
    one_child_free_used = free_visits_used,
    barcode = qr_code
WHERE total_visits > 0;
```

## 📊 Expected Results

After migration, you should see:
- ✅ New columns in users table (barcode, one_child_*, two_kids_*)
- ✅ New columns in visits table (product_type, notes)
- ✅ Existing user data migrated to one_child fields
- ✅ All existing visits have product_type = 'one_child'
- ✅ Backend API responds correctly
- ✅ Scanner shows product type selector
- ✅ Profile shows separate stats

## 🎉 Success!

Once migration is complete:
1. Backend will automatically use new schema
2. Frontend will show product type selector
3. Users will see separate tracking
4. System is ready for production use!

---

**Need Help?**
- Check Railway logs: `railway logs`
- Check backend deployment status in Railway dashboard
- Verify MySQL service is running
- Test with a sample user first