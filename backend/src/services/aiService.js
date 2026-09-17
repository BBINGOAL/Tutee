const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

const getRecommendations = async (requirement) => {
    const response = await axios.post(`${AI_SERVICE_URL}/api/v1/recommend`, requirement);
    return response.data;
};

const askQuestion = async (question) => {
    const response = await axios.post(`${AI_SERVICE_URL}/api/v1/ask`, { question });
    return response.data;
};

module.exports = { getRecommendations, askQuestion };
