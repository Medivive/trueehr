// During startup, check essential services before accepting traffic
const express = require('express');
const db = require('./config/database');
require('dotenv').config();

const app = express();

async function preflightChecks() {
  console.log('Preflight: checking database connectivity...');
  await db.connect();
  console.log('Database OK');
  // Optionally, add checks for API or cache
}

preflightChecks()
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`TrueEHR server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Service startup failed:', err.message);
    process.exit(1);
  });
