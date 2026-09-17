const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_tutee_key';

// Middleware ตรวจสอบว่ามี Token และ Token ถูกต้องไหม
const verifyToken = (req, res, next) => {
  // อ่าน token จาก header "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // ใช้ jwt.verify เพื่อเช็ค signature ถ้าถูกจะคืนค่า payload กลับมา
    const decoded = jwt.verify(token, JWT_SECRET);
    // แนบข้อมูล payload (มี userId และ role) ไปกับ request object เพื่อให้ route ถัดไปใช้ได้
    req.user = decoded;
    
    // เรียก next() เพื่อให้ข้ามไปทำงานฟังก์ชันต่อไปใน route
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

// Middleware สำหรับเช็คว่าเป็น admin ไหม (ต้องเรียกใช้ต่อจาก verifyToken)
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Requires admin role.' });
  }
};

module.exports = {
  verifyToken,
  isAdmin
};
