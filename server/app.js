const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use('/api', apiRoutes);

// Health endpoint for Docker healthcheck
app.get('/health', (req, res) => res.json({status: 'ok'}));

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`TrueEHR server listening on port ${PORT}`);
});

module.exports = app;