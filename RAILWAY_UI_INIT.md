# Initialize Database via Railway UI

## 📋 Step-by-Step Guide

### Step 1: Create Users Table

1. Go to https://railway.app
2. Open `bubko-loyalty` project
3. Click `MySQL` service
4. Click `Data` tab
5. Click `Create table` button
6. **Table name:** `users`
7. Add these columns one by one:

| Column Name | Type | Constraints |
|------------|------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| first_name | VARCHAR(100) | NOT NULL |
| last_name | VARCHAR(100) | NOT NULL |
| phone | VARCHAR(20) | NULL |
| qr_code | VARCHAR(255) | UNIQUE, NOT NULL |
| barcode | VARCHAR(255) | UNIQUE, NULL |
| one_child_visits | INT | DEFAULT 0 |
| one_child_free_earned | INT | DEFAULT 0 |
| one_child_free_used | INT | DEFAULT 0 |
| two_kids_visits | INT | DEFAULT 0 |
| two_kids_free_earned | INT | DEFAULT 0 |
| two_kids_free_used | INT | DEFAULT 0 |
| total_visits | INT | DEFAULT 0 |
| free_visits_earned | INT | DEFAULT 0 |
| free_visits_used | INT | DEFAULT 0 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

8. Click `Create`

### Step 2: Create Admin_Users Table

1. Click `Create table` button again
2. **Table name:** `admin_users`
3. Add these columns:

| Column Name | Type | Constraints |
|------------|------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| username | VARCHAR(100) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| email | VARCHAR(255) | NOT NULL |
| role | ENUM('admin', 'staff') | DEFAULT 'staff' |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

4. Click `Create`

### Step 3: Create Visits Table

1. Click `Create table` button again
2. **Table name:** `visits`
3. Add these columns:

| Column Name | Type | Constraints |
|------------|------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| user_id | INT | NOT NULL, FOREIGN KEY → users(id) |
| visit_date | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| product_type | ENUM('one_child', 'two_kids') | NOT NULL, DEFAULT 'one_child' |
| is_free_visit | BOOLEAN | DEFAULT FALSE |
| scanned_by | INT | NULL, FOREIGN KEY → admin_users(id) |
| notes | TEXT | NULL |

4. Click `Create`

### Step 4: Insert Admin User

Now we need to insert the admin user. Railway might have a way to insert data through the UI, or we can use the Railway CLI:

```bash
cd bubko-loyalty/backend
railway service MySQL
railway run mysql -e "INSERT INTO admin_users (username, password_hash, email, role) VALUES ('admin', '\$2b\$10\$rQZ8kqH5jF9yGzJ3mK7L8eX9vN2wP4tR6sA1bC3dE5fG7hI9jK0lM', 'admin@bubko.sk', 'admin');"
```

## 🚀 Alternative: Use Railway CLI with SQL File

If the UI is too tedious, you can use Railway CLI:

```bash
cd bubko-loyalty/backend
railway service MySQL
railway run mysql railway < ../database/init-railway.sql
```

## 🎯 Even Easier: Deploy Init Script

Let me create a special endpoint in the backend that initializes the database when called:

1. I'll add an init endpoint to the backend
2. You call it once via HTTP
3. It creates all tables and admin user
4. Then we disable/remove the endpoint

Would you like me to create this init endpoint?

## ✅ Verify After Creation

Once tables are created, test:

```bash
curl -X POST https://perceptive-radiance-production.up.railway.app/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Should return a token!

---

**Recommendation:** Creating tables via UI is tedious. Let me create an HTTP endpoint that initializes the database - much easier!