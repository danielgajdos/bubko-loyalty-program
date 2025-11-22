-- Bubko Kids Place Loyalty Program Database Schema V2
-- Updated to support different product types (1 child vs 2 kids)

CREATE DATABASE IF NOT EXISTS bubko_loyalty;
USE bubko_loyalty;

-- Drop existing tables if updating
-- DROP TABLE IF EXISTS visits;
-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS admin_users;

-- Users table (updated with product-specific tracking)
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

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff') DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Visits table (updated with product type)
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

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, password_hash, email, role) 
VALUES ('admin', '$2b$10$rQZ8kqH5jF9yGzJ3mK7L8eX9vN2wP4tR6sA1bC3dE5fG7hI9jK0lM', 'admin@bubko.sk', 'admin')
ON DUPLICATE KEY UPDATE username=username;

-- Migration script to add new columns to existing users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS barcode VARCHAR(255) UNIQUE AFTER qr_code,
ADD COLUMN IF NOT EXISTS one_child_visits INT DEFAULT 0 AFTER barcode,
ADD COLUMN IF NOT EXISTS one_child_free_earned INT DEFAULT 0 AFTER one_child_visits,
ADD COLUMN IF NOT EXISTS one_child_free_used INT DEFAULT 0 AFTER one_child_free_earned,
ADD COLUMN IF NOT EXISTS two_kids_visits INT DEFAULT 0 AFTER one_child_free_used,
ADD COLUMN IF NOT EXISTS two_kids_free_earned INT DEFAULT 0 AFTER two_kids_visits,
ADD COLUMN IF NOT EXISTS two_kids_free_used INT DEFAULT 0 AFTER two_kids_free_earned;

-- Migration script to add product_type to existing visits table
ALTER TABLE visits 
ADD COLUMN IF NOT EXISTS product_type ENUM('one_child', 'two_kids') NOT NULL DEFAULT 'one_child' AFTER visit_date,
ADD COLUMN IF NOT EXISTS notes TEXT AFTER scanned_by;

-- Migrate existing data (copy total_visits to one_child_visits for backward compatibility)
UPDATE users 
SET one_child_visits = total_visits,
    one_child_free_earned = free_visits_earned,
    one_child_free_used = free_visits_used,
    barcode = qr_code
WHERE one_child_visits = 0 AND total_visits > 0;
