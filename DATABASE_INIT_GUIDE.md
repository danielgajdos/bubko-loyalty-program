# Railway Database Initialization Guide

## 🔴 Database is Empty - Initialize First!

The Railway MySQL database needs to be initialized with tables before the system can work.

## 📋 Step-by-Step Initialization

### Step 1: Access Railway MySQL Console

1. Go to https://railway.app
2. Login to your account
3. Open your `bubko-loyalty` project
4. Click on the `MySQL` service
5. Click on the `Data` tab
6. Click the `Query` button (top right)

### Step 2: Run Initialization Script

Copy and paste **ALL** of the following SQL into the query editor and click "Run":

```sql
-- Create users table with all columns (including new product tracking)
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
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff') DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create visits table with product type support
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
);

-- Insert default admin user (username: admin, password: admin123)
INSERT INTO admin_users (username, password_hash, email, role) 
VALUES ('admin', '$2b$10$rQZ8kqH5jF9yGzJ3mK7L8eX9vN2wP4tR6sA1bC3dE5fG7hI9jK0lM', 'admin@bubko.sk', 'admin')
ON DUPLICATE KEY UPDATE username=username;
```

### Step 3: Verify Initialization

Run this query to verify everything was created:

```sql
SHOW TABLES;
SELECT COUNT(*) as admin_users FROM admin_users;
```

You should see:
- 3 tables: `admin_users`, `users`, `visits`
- 1 admin user

## ✅ Test the System

After initialization, test that everything works:

### 1. Test Backend Health
```bash
curl https://perceptive-radiance-production.up.railway.app/api/health
```
Expected: `{"status":"OK",...}`

### 2. Test Admin Login
```bash
curl -X POST https://perceptive-radiance-production.up.railway.app/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```
Expected: `{"message":"Admin login successful","token":"..."}`

### 3. Test in Browser

1. **Go to your frontend** (Vercel URL)
2. **Click "Riadiace centrum"** (Admin link at bottom)
3. **Login:**
   - Username: `admin`
   - Password: `admin123`
4. **You should see:**
   - Admin dashboard with statistics
   - Link to "Správa používateľov" (User Management)
   - Link to "QR Skener" (Scanner)

### 4. Test Scanner

1. Go to Scanner from admin dashboard
2. You should see:
   - Product type selector (1 dieťa / 2 deti)
   - QR code input field
   - Camera scanner option

## 🎉 Success!

Once initialization is complete:
- ✅ Database has all tables
- ✅ Admin user created (admin/admin123)
- ✅ Backend can connect to database
- ✅ Admin login works
- ✅ All features operational

## 📊 What Was Created

### Tables:

1. **users** - Customer accounts
   - Basic info (name, email, phone)
   - QR code and barcode
   - Separate tracking for "1 child" and "2 kids" products
   - Legacy fields for backward compatibility

2. **admin_users** - Admin accounts
   - Username: `admin`
   - Password: `admin123`
   - Role: admin

3. **visits** - Visit history
   - Links to users
   - Product type (one_child / two_kids)
   - Free visit flag
   - Timestamp

## 🔍 Troubleshooting

### "Table already exists" Error
- This is OK! It means the table was already created
- Continue with the next command

### Admin Login Still Fails
1. Check Railway logs: `railway logs`
2. Verify backend is running: Check health endpoint
3. Clear browser cache and try again
4. Try in incognito/private window

### Can't Access Railway Console
- Make sure you're logged in to Railway
- Check you have access to the bubko-loyalty project
- Try the MySQL service directly from project dashboard

### Backend Shows Database Errors
- Check MySQL service is running in Railway
- Verify environment variables are set (DB_HOST, DB_USER, etc.)
- Check Railway logs for connection errors

## 📞 Need Help?

- Check `TROUBLESHOOTING.md` for common issues
- Check Railway logs: `railway logs`
- Verify MySQL service status in Railway dashboard
- Test backend health endpoint

---

**Current Status:**
- ✅ Backend: Live and running
- ✅ Frontend: Deployed on Vercel
- ⏳ Database: Empty (YOU ARE HERE)

**Next Step:** Run the initialization SQL in Railway MySQL console!

**After Initialization:**
- Test admin login
- Create test user
- Test QR scanning
- Verify all features work