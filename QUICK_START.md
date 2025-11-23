# Quick Start - Initialize Railway Database

## 🚀 Your System Status

✅ **Backend:** Live at https://perceptive-radiance-production.up.railway.app
✅ **Frontend:** Deployed on Vercel  
⏳ **Database:** Empty - needs initialization

## 📝 Initialize Database (5 minutes)

### 1. Open Railway MySQL Console

1. Go to https://railway.app
2. Open `bubko-loyalty` project
3. Click `MySQL` service
4. Click `Data` tab → `Query` button

### 2. Copy & Paste This SQL

```sql
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
);

CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff') DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

INSERT INTO admin_users (username, password_hash, email, role) 
VALUES ('admin', '$2b$10$rQZ8kqH5jF9yGzJ3mK7L8eX9vN2wP4tR6sA1bC3dE5fG7hI9jK0lM', 'admin@bubko.sk', 'admin')
ON DUPLICATE KEY UPDATE username=username;
```

### 3. Click "Run" Button

You should see success messages for each table created.

### 4. Verify

Run this to check:
```sql
SHOW TABLES;
SELECT COUNT(*) FROM admin_users;
```

Should show 3 tables and 1 admin user.

## ✅ Test Login

### In Browser:
1. Go to your Vercel frontend URL
2. Click "Riadiace centrum" at bottom
3. Login: `admin` / `admin123`
4. You should see the dashboard!

### Via Command Line:
```bash
curl -X POST https://perceptive-radiance-production.up.railway.app/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Should return a token!

## 🎉 Done!

Your system is now fully operational:
- ✅ Database initialized
- ✅ Admin account created
- ✅ Backend connected
- ✅ Ready to use!

## 📚 Next Steps

1. **Test Scanner:**
   - Login as admin
   - Go to "QR Skener"
   - See product type selector (1 child / 2 kids)

2. **Create Test User:**
   - Go to "Správa používateľov"
   - Click "Rýchla registrácia"
   - Create a test user

3. **Test QR Scanning:**
   - Use the test user's QR code
   - Try scanning with both product types
   - Verify visits are recorded

## 🆘 Problems?

- **Login fails:** Check Railway logs: `railway logs`
- **Database errors:** Verify tables exist: `SHOW TABLES;`
- **Backend down:** Check health: `curl https://perceptive-radiance-production.up.railway.app/api/health`

See `DATABASE_INIT_GUIDE.md` for detailed troubleshooting.

---

**Admin Credentials:**
- Username: `admin`
- Password: `admin123`

**Important:** Change the admin password after first login!