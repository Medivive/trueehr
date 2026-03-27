import { API_BASE_URL } from '../config/endpoints';

async function handleResponse(response) {
  if (!response.ok) {
    let errorDetail = 'Unknown error';
    try {
      const data = await response.json();
      errorDetail = data.message || JSON.stringify(data);
    } catch {}
    throw new Error(`API Error ${response.status}: ${errorDetail}`);
  }
  return response.json();
}

export async function apiFetch(path, options = {}) {
  try {
    const url = `${API_BASE_URL}${path}`;
    const response = await fetch(url, {
      credentials: 'include',
      ...options
    });
    return await handleResponse(response);
  } catch (err) {
    // Improved error logging
    if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
      // Network error or CORS issue
      console.error('Fetch failed: Possible network error, server downtime, or CORS issue.', err);
    } else {
      console.error('API fetch error:', err);
    }
    throw err;
  }
}