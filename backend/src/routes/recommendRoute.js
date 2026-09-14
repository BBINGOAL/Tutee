const express = require('express');
const router = express.Router();
const recommendController = require('../controllers/recommendController');

// กำหนดว่าถ้ามี POST request เข้ามา ให้เรียกใช้ recommendTutors ใน Controller
router.post('/', recommendController.recommendTutors);

module.exports = router;
