// Updated to use environment variables for API endpoint
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

export { API_BASE_URL };