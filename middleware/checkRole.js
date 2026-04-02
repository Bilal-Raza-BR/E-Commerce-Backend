const jwt = require('jsonwebtoken');
const { modal } = require('../Modal/modal');
require('dotenv').config();

// Middleware to check if user has admin role
const checkAdmin = async (req, res, next) => {
  try {
    console.log('Checking admin role...');

    // Get token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No authorization token provided');
      return res.status(401).send({ message: 'Authorization token is required', success: false });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token received:', token.substring(0, 10) + '...');

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.TOKEN_KEY);
      console.log('Token decoded successfully. Email:', decoded.email);
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).send({ message: 'Invalid token', success: false });
    }

    // Get user from database
    const user = await modal.findOne({ email: decoded.email });
    if (!user) {
      console.log('User not found in database:', decoded.email);
      return res.status(404).send({ message: 'User not found', success: false });
    }

    console.log('User found. Role:', user.role);

    // Check if user is admin
    if (user.role !== 'admin') {
      console.log('Access denied. User is not admin.');
      return res.status(403).send({ message: 'Access denied. Admin role required.', success: false });
    }

    console.log('Admin access granted for user:', user.email);

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Error in checkAdmin middleware:', error);
    res.status(500).send({ message: 'Server error', success: false });
  }
};

// Middleware to check if user has employee role or admin role
const checkEmployee = async (req, res, next) => {
  try {
    console.log('Checking employee/admin role...');

    // Get token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No authorization token provided');
      return res.status(401).send({ message: 'Authorization token is required', success: false });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token received:', token.substring(0, 10) + '...');

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.TOKEN_KEY);
      console.log('Token decoded successfully. Email:', decoded.email);
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).send({ message: 'Invalid token', success: false });
    }

    // Get user from database
    const user = await modal.findOne({ email: decoded.email });
    if (!user) {
      console.log('User not found in database:', decoded.email);
      return res.status(404).send({ message: 'User not found', success: false });
    }

    console.log('User found. Role:', user.role);

    // Check if user is admin or employee
    if (user.role !== 'admin' && user.role !== 'employee') {
      console.log('Access denied. User is not admin or employee.');
      return res.status(403).send({ message: 'Access denied. Employee or admin role required.', success: false });
    }

    console.log('Access granted for user:', user.email, 'with role:', user.role);

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Error in checkEmployee middleware:', error);
    res.status(500).send({ message: 'Server error', success: false });
  }
};

module.exports = { checkAdmin, checkEmployee };
