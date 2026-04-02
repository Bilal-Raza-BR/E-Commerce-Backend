const express =require('express');
let MyRouter = express.Router();
const auth =require('../middleware/auth')
const verifyToken = require('../middleware/verifyToken')
const { checkAdmin, checkEmployee } = require('../middleware/checkRole')
const signupcon = require('../controlar/SignupCon')
const loginCon =require('../controlar/loginCon')

const getUserCon = require('../controlar/getUserCon');
const adminLoginCon = require('../controlar/adminLogin');
const forgatPass = require('../controlar/forgatPass');
const verifyOtp = require('../controlar/verifyOtp');
const { createOrder, getUserOrders, getOrderById } = require('../controlar/orderCon');
const {
  getAllUsers,
  getAllEmployees,
  getAllCustomers,
  getAllOrders,
  getRecentOrders,
  getAdminStats,
  getEmployeeStats,
  updateOrderStatus,
  deleteOrder,
  deleteEmployee
} = require('../controlar/dashboardCon');
const {
  uploadMiddleware,
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct
} = require('../controlar/adminProductCon');


MyRouter.post('/signup',auth,signupcon)

MyRouter.post('/login',loginCon)

// MyRouter.post('/product',cheakPro,productCon)

MyRouter.post('/admin/signup',auth,signupcon)

MyRouter.post('/admin/login',adminLoginCon)

MyRouter.get('/user', verifyToken, getUserCon)

// Order routes
MyRouter.post('/orders', verifyToken, createOrder)
MyRouter.get('/orders', verifyToken, getUserOrders)
MyRouter.get('/orders/:orderId', verifyToken, getOrderById)

// Dashboard routes - Admin only
MyRouter.get('/admin/users', checkAdmin, getAllUsers)
MyRouter.get('/admin/employees', checkAdmin, getAllEmployees)
MyRouter.delete('/admin/employees/:employeeId', checkAdmin, deleteEmployee)
MyRouter.get('/admin/orders', checkAdmin, getAllOrders)
MyRouter.get('/admin/stats', checkAdmin, getAdminStats)

// Dashboard routes - Employee and Admin
MyRouter.get('/dashboard/customers', checkEmployee, getAllCustomers)
MyRouter.get('/dashboard/recent-orders', checkEmployee, getRecentOrders)
MyRouter.get('/dashboard/employee-stats', checkEmployee, getEmployeeStats)
MyRouter.post('/dashboard/update-order-status', checkEmployee, updateOrderStatus)
MyRouter.delete('/dashboard/orders/:orderId', checkEmployee, deleteOrder)

// Product routes - Admin only
MyRouter.post('/admin/products', checkAdmin, uploadMiddleware, addProduct)
MyRouter.get('/admin/products', checkAdmin, getAllProducts)
MyRouter.put('/admin/products/:productId', checkAdmin, uploadMiddleware, updateProduct)
MyRouter.delete('/admin/products/:productId', checkAdmin, deleteProduct)

// Forgat Password routes
MyRouter.post("/forgot-password", forgatPass)
MyRouter.post("/verify-otp", verifyOtp)

module.exports = MyRouter