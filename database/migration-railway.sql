-- Migration Script for Railway MySQL Console
-- Run these commands ONE BY ONE in Railway Dashboard -> MySQL -> Data -> Query
-- If you get "Duplicate column" error, that's OK - it means the column already exists

-- Step 1: Add barcode column
ALTER TABLE users ADD COLUMN barcode VARCHAR(255) UNIQUE AFTER qr_code;

-- Step 2: Add one_child tracking columns
ALTER TABLE users ADD COLUMN one_child_visits INT DEFAULT 0 AFTER barcode;
ALTER TABLE users ADD COLUMN one_child_free_earned INT DEFAULT 0 AFTER one_child_visits;
ALTER TABLE users ADD COLUMN one_child_free_used INT DEFAULT 0 AFTER one_child_free_earned;

-- Step 3: Add two_kids tracking columns
ALTER TABLE users ADD COLUMN two_kids_visits INT DEFAULT 0 AFTER one_child_free_used;
ALTER TABLE users ADD COLUMN two_kids_free_earned INT DEFAULT 0 AFTER two_kids_visits;
ALTER TABLE users ADD COLUMN two_kids_free_used INT DEFAULT 0 AFTER two_kids_free_earned;

-- Step 4: Add product_type to visits table
ALTER TABLE visits ADD COLUMN product_type ENUM('one_child', 'two_kids') NOT NULL DEFAULT 'one_child' AFTER visit_date;

-- Step 5: Add notes to visits table
ALTER TABLE visits ADD COLUMN notes TEXT AFTER scanned_by;

-- Step 6: Migrate existing data (run this even if columns existed)
UPDATE users 
SET one_child_visits = COALESCE(total_visits, 0),
    one_child_free_earned = COALESCE(free_visits_earned, 0),
    one_child_free_used = COALESCE(free_visits_used, 0),
    barcode = qr_code
WHERE (one_child_visits = 0 OR one_child_visits IS NULL) AND total_visits > 0;

-- Step 7: Verify migration
SELECT 'Migration Complete!' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_visits FROM visits;

-- Step 8: Check new columns exist
SHOW COLUMNS FROM users LIKE '%child%';
SHOW COLUMNS FROM visits LIKE 'product_type';
