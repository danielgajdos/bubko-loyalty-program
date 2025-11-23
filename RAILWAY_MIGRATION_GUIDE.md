# Railway Database Migration Guide

## ✅ Backend is Now Live!

The backend is successfully deployed and running at:
https://perceptive-radiance-production.up.railway.app

## 🔧 Run Database Migration

Since the backend is live, you now need to run the database migration to add the new columns for product tracking.

### Option 1: Railway MySQL Console (Recommended - Easiest)

1. **Go to Railway Dashboard**
   - Open https://railway.app
   - Login to your account
   - Open your `bubko-loyalty` project

2. **Open MySQL Service**
   - Click on the `MySQL` service
   - Click on the `Data` tab
   - Click the `Query` button

3. **Run Migration Commands**
   Copy and paste these commands **ONE BY ONE** into the query editor:

```sql
-- Add barcode column
ALTER TABLE users ADD COLUMN barcode VARCHAR(255) UNIQUE AFTER qr_code;
```

```sql
-- Add one_child tracking columns
ALTER TABLE users ADD COLUMN one_child_visits INT DEFAULT 0 AFTER barcode;
ALTER TABLE users ADD COLUMN one_child_free_earned INT DEFAULT 0 AFTER one_child_visits;
ALTER TABLE users ADD COLUMN one_child_free_used INT DEFAULT 0 AFTER one_child_free_earned;
```

```sql
-- Add two_kids tracking columns
ALTER TABLE users ADD COLUMN two_kids_visits INT DEFAULT 0 AFTER one_child_free_used;
ALTER TABLE users ADD COLUMN two_kids_free_earned INT DEFAULT 0 AFTER two_kids_visits;
ALTER TABLE users ADD COLUMN two_kids_free_used INT DEFAULT 0 AFTER two_kids_free_earned;
```

```sql
-- Add product_type to visits table
ALTER TABLE visits ADD COLUMN product_type ENUM('one_child', 'two_kids') NOT NULL DEFAULT 'one_child' AFTER visit_date;
```

```sql
-- Add notes to visits table
ALTER TABLE visits ADD COLUMN notes TEXT AFTER scanned_by;
```

```sql
-- Migrate existing data
UPDATE users 
SET one_child_visits = COALESCE(total_visits, 0),
    one_child_free_earned = COALESCE(free_visits_earned, 0),
    one_child_free_used = COALESCE(free_visits_used, 0),
    barcode = qr_code
WHERE (one_child_visits = 0 OR one_child_visits IS NULL) AND total_visits > 0;
```

```sql
-- Verify migration
SELECT 'Migration Complete!' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_visits FROM visits;
```

4. **Check Results**
   - Each command should show "Query OK" or similar success message
   - If you get "Duplicate column" error, that's OK - it means the column already exists
   - The final SELECT should show your user count

### Option 2: MySQL Client (Advanced)

If you have MySQL client installed locally:

1. **Get MySQL Connection String**
   ```bash
   cd bubko-loyalty/backend
   railway variables | grep MYSQL_PUBLIC_URL
   ```

2. **Connect to MySQL**
   ```bash
   mysql -h [host] -u root -p [database]
   # Enter password when prompted
   ```

3. **Run Migration Script**
   ```bash
   source database/migration-railway.sql
   ```

## ✅ Verify Migration Success

After running the migration, test the system:

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
1. Go to your frontend URL (Vercel)
2. Click "Riadiace centrum" (Admin)
3. Login with: `admin` / `admin123`
4. You should see the dashboard
5. Go to Scanner - you should see product type selector (1 child / 2 kids)

## 🎉 After Migration

Once migration is complete:

1. ✅ Admin login will work
2. ✅ Scanner will show product type selector
3. ✅ Users can see separate stats for each product type
4. ✅ System is fully operational

## 🔍 Troubleshooting

### "Duplicate column" Error
- This is OK! It means the column already exists
- Continue with the next command

### "Table doesn't exist" Error
- The database might not be initialized
- Check if the backend deployed correctly
- Check Railway logs: `railway logs`

### Login Still Fails After Migration
- Clear browser cache and cookies
- Try in incognito/private window
- Check Railway logs for errors
- Verify JWT_SECRET is set in Railway variables

### Can't Access Railway Dashboard
- Make sure you're logged in to Railway
- Check you have access to the bubko-loyalty project
- Try logging out and back in

## 📞 Need Help?

Check these resources:
- `TROUBLESHOOTING.md` - Common issues and fixes
- `CURRENT_STATUS.md` - Current system status
- Railway logs: `railway logs`
- Backend health: https://perceptive-radiance-production.up.railway.app/api/health

---

**Current Status:**
- ✅ Backend: Live and running
- ✅ Frontend: Deployed on Vercel
- ⏳ Database: Migration pending (YOU ARE HERE)
- ⏳ Testing: Pending migration completion

**Next Step:** Run the migration commands in Railway MySQL console!