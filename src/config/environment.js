// Ensure environment variables are loaded and validated
require('dotenv').config();

['DB_URI', 'API_BASE_URL'].forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing required env: ${key}`);
    process.exit(1);
  }
});
