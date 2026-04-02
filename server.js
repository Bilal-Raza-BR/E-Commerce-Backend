const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
const dbConnect = require('../backend/config/db');
const MyRouter = require('../backend/routes/route');
const seedProductRouter = require('./until/seedProduct');
require('dotenv').config();

// Middleware
app.use(cors()); // ye pakage bakend ko batata hy k fornted trusted hy warna backend data nhi bhejta kio k BE ka port or FE ka port alag alag hota hy
app.use(express.json());

// Connect to database
dbConnect();

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Use the seedProduct router for product-related routes
app.use('/api', seedProductRouter);

// Use the main router for other routes
app.use(MyRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler caught:', err);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`
  });
});

// Start server
app.listen(port, () => {
  console.log("Server is Running on ", port);
  console.log(`API URL: http://localhost:${port}`);
});