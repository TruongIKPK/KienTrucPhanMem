const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();

// PostgreSQL connection
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres123',
  database: process.env.POSTGRES_DB || 'voting_db',
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT option, count FROM results ORDER BY count DESC');
    const votes = result.rows;
    const totalVotes = votes.reduce((sum, v) => sum + v.count, 0);
    
    res.render('index', { votes, totalVotes });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Error fetching results');
  }
});

app.get('/api/results', async (req, res) => {
  try {
    const result = await pool.query('SELECT option, count FROM results ORDER BY count DESC');
    res.json({
      votes: result.rows,
      totalVotes: result.rows.reduce((sum, v) => sum + v.count, 0),
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`✓ Result server running on port ${PORT}`);
});
