require('dotenv').config(); 
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.NAME,
  host: 'localhost',
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    res.status(500).send('Database connection failed');
  } else {
    console.log('Database connected:', res.rows);
  }
});

module.exports = pool;
