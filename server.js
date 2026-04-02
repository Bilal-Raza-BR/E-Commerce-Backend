const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Use environment port (Railway) or fallback to 5000 (local)
const port = process.env.PORT || 5000;

// Import database connection and routers
const dbConnect = require('../backend/config/db');
const MyRouter = require('../backend/routes/route');
const seedProductRouter = require('./until/seedProduct');

// Middleware
// Railway par deploy karte waqt FRONTEND_URL env variable set karein
const allowedOrigin = process.env.FRONTEND_URL || "https://e-commerce-frontend-seven-lyart.vercel.app";

app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));
app.use(express.json());

// Connect to database
dbConnect();

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routers
app.use('/api', seedProductRouter); // product-related routes
app.use(MyRouter); // other routes

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler caught:', err);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Export for Vercel
module.exports = app;