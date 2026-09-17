const { Pool } = require('pg');
require('dotenv').config();

// บังคับใช้ 5435 ชั่วคราวเพื่อหลีกเลี่ยงปัญหา .env ค้างในเครื่อง
const connectionString = 'postgres://postgres:postgres@localhost:5435/tutee';

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
