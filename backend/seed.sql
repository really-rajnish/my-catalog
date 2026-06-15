-- SQL DDL Script for PostgreSQL (pgAdmin compatible)
-- Database name: product_catalog

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS pricing (
    product_id INTEGER PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    price DOUBLE PRECISION NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    discount DOUBLE PRECISION DEFAULT 0.0
);

CREATE TABLE IF NOT EXISTS inventory (
    product_id INTEGER PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    warehouse_location VARCHAR(100),
    status VARCHAR(50) NOT NULL
);

-- 2. Clear Legacy Datasets
TRUNCATE inventory, pricing, products, categories, users RESTART IDENTITY CASCADE;

-- 3. Populate Users
INSERT INTO users (email, password_hash, role) VALUES
('user@demo.com', '$2b$12$lLb./IAHnEpaFnjH7DRaV.6oVMl93dagqXIqV9flmIotffc0IX2lK', 'USER'),
('admin@demo.com', '$2b$12$oBgIGX4VPlJ2Jk8dC1933u4VBjTFYX7O/zLnoMwW68lEw.UngeIVe', 'ADMIN');

-- 3. Populate Categories
INSERT INTO categories (id, name, parent_id) VALUES
(1, 'Electronics', NULL),
(2, 'Laptops', 1),
(3, 'Phones', 1),
(4, 'Audio', 1),
(5, 'Photography', 1),
(6, 'Home Appliances', NULL),
(7, 'Smart Home', 6);

-- 4. Populate Products
INSERT INTO products (id, name, category_id, sku, description) VALUES
(1, 'ASUS ROG Zephyrus G14', 2, 'LAP-ROG-G14', 'Compact 14-inch premium laptop optimized for enthusiast gamers and power users.'),
(2, 'Lenovo ThinkPad X1 Carbon', 2, 'LAP-TPK-X1C', 'Ultra-lightweight professional business laptop with high durability and security features.'),
(3, 'Acer Chromebook Spin 713', 2, 'LAP-ACR-S713', 'Affordable and budget-friendly convertible laptop ideal for students, office work, and web browsing.'),
(4, 'Apple iPhone 15 Pro Max', 3, 'PHN-APL-I15PM', 'Premium flagship smartphone with a titanium frame, custom Action button, and ultimate triple lens system.'),
(5, 'Google Pixel 8 Pro', 3, 'PHN-GGL-P8P', 'Advanced AI-powered Android smartphone featuring a professional-grade camera with advanced photography lenses.'),
(6, 'Samsung Galaxy A54 5G', 3, 'PHN-SAM-A54', 'Cheap, highly reliable mid-range smartphone with a high refresh rate screen and great battery life.'),
(7, 'Sony WH-1000XM5', 4, 'AUD-SON-XM5', 'Top-tier premium over-ear headphones with industry-leading active noise cancellation (ANC).'),
(8, 'Anker Soundcore Life Q30', 4, 'AUD-ANK-Q30', 'Extremely affordable wireless headphones featuring active noise cancellation and heavy bass at a budget price.'),
(9, 'Sony Alpha 7 IV', 5, 'CAM-SON-A74', 'High-performance full-frame mirrorless digital camera designed for professional photographers and video creators.'),
(10, 'DJI Mini 4 Pro Drone', 5, 'CAM-DJI-M4P', 'Ultra-lightweight portable folding camera drone featuring omnidirectional obstacle sensing and 4K HDR video.'),
(11, 'Google Nest Thermostat', 7, 'SHM-GGL-NST', 'Smart learning thermostat that programs itself to help save energy and electricity in your home.'),
(12, 'Philips Hue Starter Kit', 7, 'SHM-PHH-HUE', 'Personal wireless smart lighting system with color-changing LED bulbs and Hue bridge controller.'),
(13, 'EcoFlow River 2 Power Station', 7, 'SHM-ECF-RIV2', 'Portable solar generator and backup battery supply for camping, outdoors, and household emergencies.'),
(14, 'Razer Blade 16 Gaming Laptop', 2, 'LAP-RZR-B16', 'High-end powerhouse laptop featuring a dual-mode Mini-LED display and top-tier NVIDIA graphics card.'),
(15, 'Fujifilm X-T5 Mirrorless', 5, 'CAM-FUJ-XT5', 'Classic retro-styled digital camera specializing in raw film-simulation color palettes and photography accuracy.');

-- Adjust identity sequence
SELECT setval('products_id_seq', 15);
SELECT setval('categories_id_seq', 7);

-- 5. Populate Pricing
INSERT INTO pricing (product_id, price, currency, discount) VALUES
(1, 1499.99, 'USD', 0.05),
(2, 1799.00, 'USD', 0.00),
(3, 449.00, 'USD', 0.15),
(4, 1199.00, 'USD', 0.00),
(5, 999.00, 'USD', 0.10),
(6, 329.99, 'USD', 0.05),
(7, 398.00, 'USD', 0.08),
(8, 79.99, 'USD', 0.20),
(9, 2498.00, 'USD', 0.00),
(10, 759.00, 'USD', 0.00),
(11, 249.00, 'USD', 0.10),
(12, 199.99, 'USD', 0.00),
(13, 299.00, 'USD', 0.12),
(14, 2999.99, 'USD', 0.00),
(15, 1699.00, 'USD', 0.05);

-- 6. Populate Inventory
INSERT INTO inventory (product_id, quantity, warehouse_location, status) VALUES
(1, 15, 'WH-A1', 'IN_STOCK'),
(2, 8, 'WH-A2', 'IN_STOCK'),
(3, 30, 'WH-A3', 'IN_STOCK'),
(4, 20, 'WH-B1', 'IN_STOCK'),
(5, 25, 'WH-B2', 'IN_STOCK'),
(6, 45, 'WH-B3', 'IN_STOCK'),
(7, 12, 'WH-C1', 'IN_STOCK'),
(8, 60, 'WH-C2', 'IN_STOCK'),
(9, 6, 'WH-D1', 'IN_STOCK'),
(10, 10, 'WH-D2', 'IN_STOCK'),
(11, 18, 'WH-E1', 'IN_STOCK'),
(12, 14, 'WH-E2', 'IN_STOCK'),
(13, 0, 'WH-E3', 'OUT_OF_STOCK'),
(14, 4, 'WH-A1', 'IN_STOCK'),
(15, 7, 'WH-D1', 'IN_STOCK');
