-- Create sample table for testing
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  age INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (name, email, age) VALUES
  ('John Doe', 'john@example.com', 28),
  ('Jane Smith', 'jane@example.com', 32),
  ('Bob Johnson', 'bob@example.com', 25),
  ('Alice Brown', 'alice@example.com', 30);

-- Create another table to demonstrate volume persistence
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(150) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample products
INSERT INTO products (product_name, price, stock) VALUES
  ('Laptop', 999.99, 50),
  ('Mouse', 29.99, 100),
  ('Keyboard', 79.99, 75),
  ('Monitor', 299.99, 30);
