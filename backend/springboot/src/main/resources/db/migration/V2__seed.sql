-- V2__seed.sql

-- Drop legacy username column if it exists
ALTER TABLE users DROP COLUMN IF EXISTS username;

-- Insert missing seed users (DO NOTHING if exists because email is unique)
INSERT INTO users (email, password_hash, role) VALUES 
('user@demo.com', '$2a$10$xyz', 'USER'),
('admin@demo.com', '$2a$10$xyz', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- Seed Categories
INSERT INTO categories (name, slug, description) VALUES
('Smartphones', 'smartphones', 'Latest mobile phones'),
('Laptops', 'laptops', 'High performance computing'),
('Audio', 'audio', 'Headphones and speakers')
ON CONFLICT (slug) DO NOTHING;

-- Seed Products
INSERT INTO products (name, brand, price, category_id, in_stock, stock_count) VALUES
('Google Pixel 8 Pro', 'Google', 999.00, 1, true, 50),
('Apple iPhone 15 Pro', 'Apple', 1199.00, 1, true, 100),
('Samsung Galaxy S24 Ultra', 'Samsung', 1299.00, 1, true, 75),
('Google Pixel 8', 'Google', 699.00, 1, true, 40),
('Apple iPhone 15', 'Apple', 799.00, 1, true, 200),
('Samsung Galaxy S24', 'Samsung', 799.00, 1, true, 150),
('Google Pixel Fold', 'Google', 1799.00, 1, false, 0),
('Apple iPhone 15 Plus', 'Apple', 899.00, 1, true, 80),
('MacBook Pro 16" M3 Max', 'Apple', 3499.00, 2, true, 25),
('Dell XPS 15', 'Dell', 1899.00, 2, true, 30),
('ThinkPad X1 Carbon', 'Lenovo', 1599.00, 2, true, 45),
('Razer Blade 16', 'Razer', 2999.00, 2, true, 15),
('Surface Laptop Studio 2', 'Microsoft', 2399.00, 2, false, 0),
('AirPods Pro (2nd Gen)', 'Apple', 249.00, 3, true, 300),
('Sony WH-1000XM5', 'Sony', 398.00, 3, true, 120),
('Bose QuietComfort Ultra', 'Bose', 429.00, 3, true, 90),
('Sennheiser Momentum 4', 'Sennheiser', 349.00, 3, true, 60),
('Samsung Galaxy Buds 2 Pro', 'Samsung', 229.00, 3, true, 150),
('Google Pixel Buds Pro', 'Google', 199.00, 3, true, 110),
('Beats Studio Pro', 'Beats', 349.00, 3, false, 0),
('Asus ROG Zephyrus G14', 'Asus', 1699.00, 2, true, 20);
