const { orderModal } = require('../Modal/orderModal');
const { modal } = require('../Modal/modal');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Create a new order
const createOrder = async (req, res) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send({ message: 'Authorization token is required', success: false });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.TOKEN_KEY);
    } catch (error) {
      return res.status(401).send({ message: 'Invalid token', success: false });
    }

    // Get user from database
    const user = await modal.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).send({ message: 'User not found', success: false });
    }

    // Get order data from request body
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).send({ message: 'Order must contain at least one item', success: false });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).send({ message: 'Total amount is required and must be greater than 0', success: false });
    }

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.address ||
        !shippingAddress.city || !shippingAddress.postalCode ||
        !shippingAddress.country || !shippingAddress.phone) {
      return res.status(400).send({ message: 'Complete shipping address is required', success: false });
    }

    if (!paymentMethod) {
      return res.status(400).send({ message: 'Payment method is required', success: false });
    }

    // Create new order
    const newOrder = new orderModal({
      user: user._id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
      orderStatus: 'processing'
    });

    // Save order to database
    await newOrder.save();

    // Return success response
    res.status(201).send({
      success: true,
      message: 'Order created successfully',
      orderId: newOrder._id
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).send({ message: 'Server error', success: false });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send({ message: 'Authorization token is required', success: false });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.TOKEN_KEY);
    } catch (error) {
      return res.status(401).send({ message: 'Invalid token', success: false });
    }

    // Get user from database
    const user = await modal.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).send({ message: 'User not found', success: false });
    }

    // Get user orders
    const orders = await orderModal.find({ user: user._id })
      .populate({
        path: 'user',
        select: 'name email contact',
        model: 'signup-E-Commerce'
      })
      .sort({ createdAt: -1 });

    // Return orders
    res.status(200).send(orders);

  } catch (error) {
    console.error('Error getting user orders:', error);
    res.status(500).send({ message: 'Server error', success: false });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send({ message: 'Authorization token is required', success: false });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.TOKEN_KEY);
    } catch (error) {
      return res.status(401).send({ message: 'Invalid token', success: false });
    }

    // Get user from database
    const user = await modal.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).send({ message: 'User not found', success: false });
    }

    // Get order ID from request params
    const { orderId } = req.params;

    // Get order
    const order = await orderModal.findById(orderId)
      .populate({
        path: 'user',
        select: 'name email contact',
        model: 'signup-E-Commerce'
      });

    // Check if order exists
    if (!order) {
      return res.status(404).send({ message: 'Order not found', success: false });
    }

    // Check if order belongs to user
    if (order.user._id.toString() !== user._id.toString()) {
      return res.status(403).send({ message: 'Unauthorized access to order', success: false });
    }

    // Return order
    res.status(200).send(order);

  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).send({ message: 'Server error', success: false });
  }
};

module.exports = { createOrder, getUserOrders, getOrderById };
