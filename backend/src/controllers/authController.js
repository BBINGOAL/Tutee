const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// ใช้ secret จาก .env ถ้าไม่มีใช้ fallback สำหรับทดสอบ
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_tutee_key';

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate: เช็คว่าส่งข้อมูลมาครบไหม
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // 2. ตรวจสอบว่ามีอีเมลนี้ในระบบหรือยัง
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // 3. Hash: เข้ารหัสรหัสผ่านด้วย bcrypt
    // เลข 10 คือ salt rounds (ยิ่งเยอะยิ่งปลอดภัยแต่ยิ่งช้า 10-12 คือมาตรฐาน)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 4. บันทึกลง Database
    const newUser = await userModel.createUser(email, passwordHash);

    // 5. Generate Token: สร้าง JWT ทันทีให้ไม่ต้องล็อกอินซ้ำ
    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' } // Token มีอายุ 24 ชม.
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate inputs
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // 2. หา user จากอีเมล
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 3. Compare: เทียบ plain text ที่ส่งมา กับ hash ใน database
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 4. Generate Token: ถ้าผ่าน สร้าง JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, role: user.role },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  register,
  login
};
