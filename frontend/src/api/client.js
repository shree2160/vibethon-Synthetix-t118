import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
});

export const executeCode = async (code) => {
  const response = await api.post('/execute', { code });
  return response.data;
};

export const analyzeSentiment = async (text) => {
  const response = await api.post('/simulate/sentiment', { text });
  return response.data;
};

export default api;
