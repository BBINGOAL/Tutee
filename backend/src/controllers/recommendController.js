const aiService = require('../services/aiService');

const recommendTutors = async (req, res) => {
    try {
        const requirement = req.body;

        // ตรวจสอบข้อมูลเบื้องต้น ถ้าลืมส่ง subject มา ให้ตีกลับไปเลย (400 Bad Request)
        if (!requirement.subject) {
            return res.status(400).json({ error: "กรุณาระบุวิชา (subject) ที่ต้องการเรียน" });
        }

        // สั่งให้ Service ทำงานไปเรียก FastAPI
        const results = await aiService.getRecommendations(requirement);
        
        // ส่งผลลัพธ์กลับไปให้ React
        return res.json(results);

    } catch (error) {
        console.error("Error calling AI Service:", error.message);
        
        // ถ้า error มาจาก axios (เช่น FastAPI ตอบกลับมาเป็น Error หรือ FastAPI ปิดอยู่)
        if (error.response) {
            return res.status(error.response.status).json({ 
                error: "ระบบ AI ขัดข้องชั่วคราว", 
                details: error.response.data 
            });
        }
        
        // ถ้า Error อื่นๆ (เช่น Network พัง, พิมพ์โค้ดผิด)
        return res.status(503).json({ error: "ไม่สามารถเชื่อมต่อกับ AI Service ได้" });
    }
};

module.exports = {
    recommendTutors
};
