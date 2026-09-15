const aiService = require('../services/aiService');

const askTutee = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message?.trim()) {
            return res.status(400).json({ error: 'กรุณาพิมพ์คำถาม' });
        }
        const result = await aiService.askQuestion(message.trim());
        return res.json(result);
    } catch (error) {
        console.error('Error calling AI Ask:', error.message);
        if (error.response) {
            return res.status(error.response.status).json({ error: 'ระบบ AI ขัดข้องชั่วคราว', details: error.response.data });
        }
        return res.status(503).json({ error: 'ไม่สามารถเชื่อมต่อกับ AI Service ได้' });
    }
};

module.exports = { askTutee };
