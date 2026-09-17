const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// ใช้ middleware ขวาง 2 ชั้น: ต้องล็อกอิน + ต้องเป็น admin
router.get('/users', verifyToken, isAdmin, adminController.getAllUsers);

module.exports = router;
