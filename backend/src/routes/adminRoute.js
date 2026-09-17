const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminTutorController = require('../controllers/adminTutorController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// ใช้ middleware ขวาง 2 ชั้น: ต้องล็อกอิน + ต้องเป็น admin
router.get('/users', verifyToken, isAdmin, adminController.getAllUsers);

// Routes สำหรับจัดการ Tutor
router.get('/tutors', verifyToken, isAdmin, adminTutorController.getAllTutors);
router.post('/tutors', verifyToken, isAdmin, adminTutorController.createTutor);
router.put('/tutors/:id', verifyToken, isAdmin, adminTutorController.updateTutor);
router.delete('/tutors/:id', verifyToken, isAdmin, adminTutorController.deleteTutor);

// Route สำหรับสั่ง Sync AI
router.post('/tutors/sync', verifyToken, isAdmin, adminTutorController.syncTutors);

module.exports = router;
