const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/tutee';
console.log('Connecting to:', connectionString);

const pool = new Pool({
  connectionString,
});

pool.query('SELECT NOW()')
  .then(res => {
    console.log('DB Connection Success:', res.rows[0]);
    process.exit(0);
  })
  .catch(err => {
    console.error('DB Connection Error:', err.message);
    process.exit(1);
  });
