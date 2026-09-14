const axios = require('axios');

// อ่าน URL จาก .env ถ้าไม่มีให้ใช้ http://127.0.0.1:8000 เป็นค่าเริ่มต้น
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

/**
 * ฟังก์ชันสำหรับยิง Request ไปให้ FastAPI คำนวณแนะนำติวเตอร์
 * @param {Object} requirement ข้อมูลความต้องการของนักเรียน
 * @returns {Promise<Array>} รายชื่อติวเตอร์พร้อมคำอธิบาย
 */
const getRecommendations = async (requirement) => {
    // ยิง POST request ไปที่ FastAPI
    const response = await axios.post(`${AI_SERVICE_URL}/api/v1/recommend`, requirement);
    
    // axios จะเก็บข้อมูลที่ส่งกลับมาไว้ใน .data
    return response.data;
};

module.exports = {
    getRecommendations
};
