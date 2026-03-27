// Enhanced middleware to handle DB connectivity issues gracefully
const db = require('../config/database');

module.exports = async (req, res, next) => {
  try {
    if (!db.isConnected()) {
      await db.connect();
    }
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(503).json({
      error: 'Service Unavailable',
      message: 'Could not connect to the database.'
    });
  }
};
