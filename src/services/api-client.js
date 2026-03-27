// Robust API client with connection error handling
const axios = require('axios');

const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:4000',
  timeout: 10000
});

apiClient.interceptors.response.use(
  res => res,
  err => {
    if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
      console.error('API endpoint unreachable:', err.config.url, err.message);
    }
    return Promise.reject(err);
  }
);

module.exports = apiClient;
