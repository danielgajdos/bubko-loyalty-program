-- Simple Migration Script for Railway MySQL Console
-- Run this in Railway Dashboard -> MySQL -> Data -> Query

-- Add barcode column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS barcode VARCHAR(255) UNIQUE AFTER qr_code;

-- Add one_child tracking columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS one_child_visits INT DEFAULT 0 AFTER barcode;
ALTER TABLE users ADD COLUMN IF NOT EXISTS one_child_free_earned INT DEFAULT 0 AFTER one_child_visits;
ALTER TABLE users ADD COLUMN IF NOT EXISTS one_child_free_used INT DEFAULT 0 AFTER one_child_free_earned;

-- Add two_kids tracking columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_kids_visits INT DEFAULT 0 AFTER one_child_free_used;
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_kids_free_earned INT DEFAULT 0 AFTER two_kids_visits;
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_kids_free_used INT DEFAULT 0 AFTER two_kids_free_earned;

-- Add product_type to visits table
ALTER TABLE visits ADD COLUMN IF NOT EXISTS product_type ENUM('one_child', 'two_kids') NOT NULL DEFAULT 'one_child' AFTER visit_date;

-- Add notes to visits table
ALTER TABLE visits ADD COLUMN IF NOT EXISTS notes TEXT AFTER scanned_by;

-- Migrate existing data
UPDATE users 
SET one_child_visits = total_visits,
    one_child_free_earned = free_visits_earned,
    one_child_free_used = free_visits_used,
    barcode = qr_code
WHERE total_visits > 0 AND (one_child_visits = 0 OR one_child_visits IS NULL);

-- Verify migration
SELECT 'Migration Complete!' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_visits FROM visits;
