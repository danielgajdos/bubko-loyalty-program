-- Copy and paste this ENTIRE block into Railway MySQL console or any MySQL client
-- This will initialize your database with all tables and the admin user

CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL, first_name VARCHAR(100) NOT NULL, last_name VARCHAR(100) NOT NULL, phone VARCHAR(20), qr_code VARCHAR(255) UNIQUE NOT NULL, barcode VARCHAR(255) UNIQUE, one_child_visits INT DEFAULT 0, one_child_free_earned INT DEFAULT 0, one_child_free_used INT DEFAULT 0, two_kids_visits INT DEFAULT 0, two_kids_free_earned INT DEFAULT 0, two_kids_free_used INT DEFAULT 0, total_visits INT DEFAULT 0, free_visits_earned INT DEFAULT 0, free_visits_used INT DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS admin_users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(100) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, role ENUM('admin', 'staff') DEFAULT 'staff', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS visits (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, product_type ENUM('one_child', 'two_kids') NOT NULL DEFAULT 'one_child', is_free_visit BOOLEAN DEFAULT FALSE, scanned_by INT, notes TEXT, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (scanned_by) REFERENCES admin_users(id));

INSERT INTO admin_users (username, password_hash, email, role) VALUES ('admin', '$2b$10$rQZ8kqH5jF9yGzJ3mK7L8eX9vN2wP4tR6sA1bC3dE5fG7hI9jK0lM', 'admin@bubko.sk', 'admin') ON DUPLICATE KEY UPDATE username=username;

SELECT 'Database initialized!' as status, (SELECT COUNT(*) FROM admin_users) as admin_users, (SELECT COUNT(*) FROM users) as users, (SELECT COUNT(*) FROM visits) as visits;
