const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'developer',
  password: process.env.DB_PASSWORD || 'dev_password',
  database: process.env.DB_NAME || 'nodeapp_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Health check endpoint
app.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query('SELECT 1');
    connection.release();
    
    res.json({
      message: 'Node.js app connected to MySQL',
      status: 'success',
      database: process.env.DB_NAME,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Get all users endpoint
app.get('/api/users', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM users');
    connection.release();
    
    res.json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// Create user endpoint
app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      message: 'Name and email are required'
    });
  }

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
    connection.release();
    
    res.status(201).json({
      status: 'success',
      message: 'User created',
      userId: result.insertId
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating user',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📦 Connected to MySQL database: ${process.env.DB_NAME}`);
});
