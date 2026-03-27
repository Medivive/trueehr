// Improved database connection logic with retries and diagnostics
const mongoose = require('mongoose');

let connection = null;
let isConnectedFlag = false;

async function connect(retries = 5) {
  if (isConnectedFlag) return connection;
  const uri = process.env.DB_URI || 'mongodb://localhost/trueehr';
  for (let i = 1; i <= retries; i++) {
    try {
      connection = await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      isConnectedFlag = true;
      return connection;
    } catch (err) {
      console.error(`DB connection attempt ${i} failed:`, err.message);
      await new Promise(res => setTimeout(res, 2000));
    }
  }
  throw new Error('Failed to connect to DB after retries');
}

function isConnected() {
  return isConnectedFlag && mongoose.connection.readyState === 1;
}

module.exports = { connect, isConnected };
