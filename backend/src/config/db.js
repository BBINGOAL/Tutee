const { Pool } = require('pg');
require('dotenv').config();

// ใช้ Connection String จาก .env หรือค่า default สำหรับ local (เปลี่ยนตามเครื่องคุณได้เลย)
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/tutee';

const pool = new Pool({
  connectionString,
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
