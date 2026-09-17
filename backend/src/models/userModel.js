const db = require('../config/db');

// ฟังก์ชันสำหรับสร้างตาราง users (เรียกใช้ตอนเปิด server หรือทำ migration)
const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'student',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await db.query(query);
    console.log('Users table initialized');
  } catch (err) {
    console.error('Error creating users table', err);
  }
};

// ฟังก์ชันหา user ด้วย email
const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const { rows } = await db.query(query, [email]);
  return rows[0];
};

// ฟังก์ชันหา user ด้วย id
const getUserById = async (id) => {
  const query = 'SELECT id, email, role, created_at FROM users WHERE id = $1';
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

// ฟังก์ชันสร้าง user ใหม่
const createUser = async (email, passwordHash, role = 'student') => {
  const query = `
    INSERT INTO users (email, password_hash, role)
    VALUES ($1, $2, $3)
    RETURNING id, email, role, created_at;
  `;
  const { rows } = await db.query(query, [email, passwordHash, role]);
  return rows[0];
};

// ฟังก์ชันดึง user ทั้งหมด (สำหรับ Admin)
const getAllUsers = async () => {
  const query = 'SELECT id, email, role, created_at FROM users ORDER BY created_at DESC';
  const { rows } = await db.query(query);
  return rows;
};

module.exports = {
  createUserTable,
  getUserByEmail,
  getUserById,
  createUser,
  getAllUsers
};
