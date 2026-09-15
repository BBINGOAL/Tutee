require('dotenv').config(); // โหลดค่าจาก .env
const express = require('express');
const cors = require('cors');

const app = express();

// --- Middlewares ---
// อนุญาต Request จากที่อื่น (สำหรับ React)
app.use(cors());
// ให้ Express อ่านข้อมูลแบบ JSON ได้
app.use(express.json());

// --- Basic Route ---
// สร้าง Route เล็กๆ ไว้ทดสอบว่า Server ทำงานปกติ
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Tutee Node.js Gateway is running!' });
});
const recommendRoute = require('./src/routes/recommendRoute');
app.use('/api/recommend', recommendRoute);

const askRoute = require('./src/routes/askRoute');
app.use('/api/ask', askRoute);


// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
