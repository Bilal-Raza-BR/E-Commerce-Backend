// const express = require('express');
// const app = express();
// const port = 5000;
// const cors = require('cors');
// const dbConnect = require('../backend/config/db');
// const MyRouter = require('../backend/routes/route');
// const seedProductRouter = require('./until/seedProduct');
// require('dotenv').config();

// // Middleware
// app.use(cors()); // ye pakage bakend ko batata hy k fornted trusted hy warna backend data nhi bhejta kio k BE ka port or FE ka port alag alag hota hy
// app.use(express.json());

// // Connect to database
// dbConnect();

// // Log all requests
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
//   next();
// });

// // Use the seedProduct router for product-related routes
// app.use('/api', seedProductRouter);

// // Use the main router for other routes
// app.use(MyRouter);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('Global error handler caught:', err);
//   res.status(500).json({
//     success: false,
//     message: 'Server error',
//     error: err.message,
//     stack: process.env.NODE_ENV === 'production' ? null : err.stack
//   });
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Route not found: ${req.method} ${req.url}`
//   });
// });

// // Start server
// app.listen(port, () => {
//   console.log("Server is Running on ", port);
//   console.log(`API URL: http://localhost:${port}`);
// });

// server.js
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
// TODO: replace below URL with your deployed frontend URL
app.use(cors({
  origin: "https://e-commerce-frontend-seven-lyart.vercel.app/",
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