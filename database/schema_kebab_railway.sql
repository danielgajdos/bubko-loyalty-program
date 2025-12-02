-- Kebab na Kyjevskom Loyalty Program Database Schema
-- Product-based loyalty: Buy 10, get 11th free
-- Modified for Railway deployment (uses existing 'railway' database)

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category ENUM('kebab', 'pizza', 'burger', 'wrap', 'salad', 'drink', 'side', 'other') NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    qr_code VARCHAR(255) UNIQUE NOT NULL,
    barcode VARCHAR(255) UNIQUE,
    gdpr_consent BOOLEAN DEFAULT FALSE,
    gdpr_consent_date TIMESTAMP NULL,
    newsletter_consent BOOLEAN DEFAULT FALSE,
    newsletter_consent_date TIMESTAMP NULL,
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

-- Product stamps table (tracks stamps per user per product)
CREATE TABLE IF NOT EXISTS product_stamps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    stamps_count INT DEFAULT 0,
    free_products_earned INT DEFAULT 0,
    free_products_used INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id)
);

-- Visits table (one visit can have multiple products)
CREATE TABLE IF NOT EXISTS visits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scanned_by INT,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (scanned_by) REFERENCES admin_users(id)
);

-- Visit items table (products purchased in each visit)
CREATE TABLE IF NOT EXISTS visit_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visit_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    is_free BOOLEAN DEFAULT FALSE,
    price_at_purchase DECIMAL(10, 2),
    FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, password_hash, email, role) 
VALUES ('admin', '$2b$10$rQZ8kqH5jF9yGzJ3mK7L8eX9vN2wP4tR6sA1bC3dE5fG7hI9jK0lM', 'admin@kebab-bb.sk', 'admin')
ON DUPLICATE KEY UPDATE username=username;

-- Insert sample products
INSERT INTO products (name, category, price) VALUES
('Kebab v placke', 'kebab', 4.50),
('Kebab v boxe', 'kebab', 4.80),
('Kebab XL', 'kebab', 5.50),
('Pizza Margherita', 'pizza', 5.00),
('Pizza Šunková', 'pizza', 5.50),
('Pizza Šalámová', 'pizza', 5.50),
('Burger Classic', 'burger', 4.20),
('Burger Bacon', 'burger', 4.80),
('Wrap Kurací', 'wrap', 4.00),
('Wrap Hovädzí', 'wrap', 4.50),
('Grécky šalát', 'salad', 3.50),
('Hranolky', 'side', 2.00),
('Cibuľové krúžky', 'side', 2.50),
('Coca Cola 0.5L', 'drink', 1.50),
('Fanta 0.5L', 'drink', 1.50)
ON DUPLICATE KEY UPDATE name=name;

-- Indexes are created automatically with foreign keys
