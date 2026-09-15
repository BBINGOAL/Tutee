import axios from 'axios';

/**
 * Axios instance สำหรับคุยกับ Node.js Backend (Port 5000)
 * React จะคุยกับ Node เท่านั้น ไม่คุยกับ FastAPI โดยตรง
 */
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    timeout: 30000,    // 30 วินาที (AI อาจใช้เวลาคิดนาน)
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * POST /api/recommend
 * ส่ง requirement ของนักเรียน → รับ top-3 tutors พร้อม AI explanation
 */
export const getRecommendations = async (requirement) => {
    const response = await apiClient.post('/api/recommend', requirement);
    return response.data;
};

/**
 * POST /api/ask
 * ส่งข้อความแชท → รับคำตอบจาก AI พร้อม tutor cards
 */
export const askTutee = async (message, history = []) => {
    const response = await apiClient.post('/api/ask', { message, history });
    return response.data;
};

export default apiClient;
