-- Demo data for Bubko Loyalty Program
-- Run this after setting up the main schema

USE bubko_loyalty;

-- Insert demo users (passwords are hashed for 'password123')
INSERT INTO users (email, password_hash, first_name, last_name, phone, qr_code, total_visits, free_visits_earned, free_visits_used) VALUES
('astronaut1@bubko.sk', '$2b$10$rQZ8kqH5jF9yGzJ3mK7L8eX9vN2wP4tR6sA1bC3dE5fG7hI9jK0lM', 'Tomáš', 'Vesmírny', '+421901234567', 'demo-qr-001', 3, 0, 0),
('astronaut2@bubko.sk', '$2b$10$rQZ8kqH5jF9yGzJ3mK7L8eX9vN2wP4tR6sA1bC3dE5fG7hI9jK0lM', 'Lucia', 'Kozmická', '+421901234568', 'demo-qr-002', 7, 1, 0),
('astronaut3@bubko.sk', '$2b$10$rQZ8kqH5jF9yGzJ3mK7L8eX9vN2wP4tR6sA1bC3dE5fG7hI9jK0lM', 'Peter', 'Galaxia', '+421901234569', 'demo-qr-003', 12, 2, 1);

-- Insert demo visits
INSERT INTO visits (user_id, visit_date, is_free_visit, scanned_by) VALUES
(1, '2024-01-15 10:30:00', FALSE, 1),
(1, '2024-01-22 14:15:00', FALSE, 1),
(1, '2024-02-05 11:45:00', FALSE, 1),
(2, '2024-01-10 09:30:00', FALSE, 1),
(2, '2024-01-17 15:20:00', FALSE, 1),
(2, '2024-01-24 13:10:00', FALSE, 1),
(2, '2024-01-31 16:45:00', FALSE, 1),
(2, '2024-02-07 10:15:00', FALSE, 1),
(2, '2024-02-14 14:30:00', TRUE, 1),
(2, '2024-02-21 12:00:00', FALSE, 1),
(3, '2024-01-05 11:00:00', FALSE, 1),
(3, '2024-01-12 15:30:00', FALSE, 1),
(3, '2024-01-19 13:45:00', FALSE, 1),
(3, '2024-01-26 10:20:00', FALSE, 1),
(3, '2024-02-02 16:10:00', FALSE, 1),
(3, '2024-02-09 14:50:00', TRUE, 1),
(3, '2024-02-16 11:30:00', FALSE, 1),
(3, '2024-02-23 15:15:00', FALSE, 1),
(3, '2024-03-01 13:20:00', FALSE, 1),
(3, '2024-03-08 10:45:00', FALSE, 1),
(3, '2024-03-15 16:30:00', FALSE, 1),
(3, '2024-03-22 12:15:00', TRUE, 1);

-- Test QR codes for demo:
-- demo-qr-001 (Tomáš - 3 visits, needs 2 more for free)
-- demo-qr-002 (Lucia - 7 visits, 1 free available)  
-- demo-qr-003 (Peter - 12 visits, 1 free available)