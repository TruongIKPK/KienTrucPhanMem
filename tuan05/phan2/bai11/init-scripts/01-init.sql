-- Create sample tables for testing
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data into users
INSERT INTO users (username, email) VALUES
  ('john_doe', 'john@example.com'),
  ('jane_smith', 'jane@example.com'),
  ('bob_johnson', 'bob@example.com'),
  ('alice_brown', 'alice@example.com');

-- Insert sample data into products
INSERT INTO products (name, price, stock) VALUES
  ('Laptop', 999.99, 50),
  ('Mouse', 29.99, 100),
  ('Keyboard', 79.99, 75),
  ('Monitor', 299.99, 30),
  ('Headphones', 149.99, 60);
