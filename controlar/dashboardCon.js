const { modal } = require('../Modal/modal');
const { orderModal } = require('../Modal/orderModal');
const { productModal } = require('../Modal/modal');

// Get all users (for admin)
const getAllUsers = async (req, res) => {
  try {
    // Only return non-admin users
    const users = await modal.find({ role: { $ne: 'admin' } }).select('-password');
    res.status(200).send(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send({ message: 'Server error', success: false });
  }
};

// Get all employees (for admin)
const getAllEmployees = async (req, res) => {
  try {
    const employees = await modal.find({ role: 'employee' }).select('-password');
    res.status(200).send(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).send({ message: 'Server error', success: false });
  }
};

// Get all customers (for admin and employee)
const getAllCustomers = async (req, res) => {
  try {
    const customers = await modal.find({ role: 'customer' }).select('-password');
    res.status(200).send(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).send({ message: 'Server error', success: false });
  }
};

// Get all orders (for admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModal.find()
      .populate({
        path: 'user',
        select: 'name email contact',
        model: 'signup-E-Commerce'
      })
      .sort({ createdAt: -1 });
    res.status(200).send(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send({ message: 'Server error', success: false });
  }
};

// Get recent orders (for admin and employee)
const getRecentOrders = async (req, res) => {
  try {
    // Get orders from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const orders = await orderModal.find({
      createdAt: { $gte: thirtyDaysAgo }
    })
    .populate({
      path: 'user',
      select: 'name email contact',
      model: 'signup-E-Commerce'
    })
    .sort({ createdAt: -1 });

    res.status(200).send(orders);
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    res.status(500).send({ message: 'Server error', success: false });
  }
};

// Get dashboard stats (for admin)
const getAdminStats = async (req, res) => {
  try {
    console.log('Fetching admin stats...');

    // Get total number of customers
    const totalCustomers = await modal.countDocuments({ role: 'customer' });
    console.log('Total customers:', totalCustomers);

    // Get total number of employees
    const totalEmployees = await modal.countDocuments({ role: 'employee' });
    console.log('Total employees:', totalEmployees);

    // Get total number of orders
    const totalOrders = await orderModal.countDocuments();
    console.log('Total orders:', totalOrders);

    // Get total revenue
    let totalRevenue = 0;
    try {
      const revenueResult = await orderModal.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' }
          }
        }
      ]);
      totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    } catch (err) {
      console.error('Error calculating revenue:', err);
      // Continue with totalRevenue as 0
    }
    console.log('Total revenue:', totalRevenue);

    // Get total number of products
    let totalProducts = 0;
    try {
      totalProducts = await productModal.countDocuments();
    } catch (err) {
      console.error('Error counting products:', err);
      // Continue with totalProducts as 0
    }
    console.log('Total products:', totalProducts);

    // Get recent orders (last 5)
    let recentOrders = [];
    try {
      recentOrders = await orderModal.find()
        .populate({
          path: 'user',
          select: 'name email contact',
          model: 'signup-E-Commerce'
        })
        .sort({ createdAt: -1 })
        .limit(5);
    } catch (err) {
      console.error('Error fetching recent orders:', err);
      // Continue with empty recentOrders
    }
    console.log('Recent orders count:', recentOrders.length);

    // Get order status counts
    let processingOrders = 0;
    let shippedOrders = 0;
    let deliveredOrders = 0;
    let cancelledOrders = 0;

    try {
      processingOrders = await orderModal.countDocuments({ orderStatus: 'processing' });
      shippedOrders = await orderModal.countDocuments({ orderStatus: 'shipped' });
      deliveredOrders = await orderModal.countDocuments({ orderStatus: 'delivered' });
      cancelledOrders = await orderModal.countDocuments({ orderStatus: 'cancelled' });
    } catch (err) {
      console.error('Error counting order statuses:', err);
      // Continue with counts as 0
    }

    const responseData = {
      totalCustomers,
      totalEmployees,
      totalOrders,
      totalRevenue,
      totalProducts,
      recentOrders,
      orderStatusCounts: {
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders
      }
    };

    console.log('Sending admin stats response');
    res.status(200).send(responseData);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).send({ message: 'Server error', success: false });
  }
};

// Get dashboard stats (for employee)
const getEmployeeStats = async (req, res) => {
  try {
    console.log('Fetching employee stats...');

    // Get total number of customers
    const totalCustomers = await modal.countDocuments({ role: 'customer' });
    console.log('Total customers:', totalCustomers);

    // Get total number of orders
    const totalOrders = await orderModal.countDocuments();
    console.log('Total orders:', totalOrders);

    // Get recent orders (last 5)
    let recentOrders = [];
    try {
      recentOrders = await orderModal.find()
        .populate({
          path: 'user',
          select: 'name email contact',
          model: 'signup-E-Commerce'
        })
        .sort({ createdAt: -1 })
        .limit(5);
    } catch (err) {
      console.error('Error fetching recent orders:', err);
      // Continue with empty recentOrders
    }
    console.log('Recent orders count:', recentOrders.length);

    // Get order status counts
    let processingOrders = 0;
    let shippedOrders = 0;
    let deliveredOrders = 0;
    let cancelledOrders = 0;

    try {
      processingOrders = await orderModal.countDocuments({ orderStatus: 'processing' });
      shippedOrders = await orderModal.countDocuments({ orderStatus: 'shipped' });
      deliveredOrders = await orderModal.countDocuments({ orderStatus: 'delivered' });
      cancelledOrders = await orderModal.countDocuments({ orderStatus: 'cancelled' });
    } catch (err) {
      console.error('Error counting order statuses:', err);
      // Continue with counts as 0
    }

    const responseData = {
      totalCustomers,
      totalOrders,
      recentOrders,
      orderStatusCounts: {
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders
      }
    };

    console.log('Sending employee stats response');
    res.status(200).send(responseData);
  } catch (error) {
    console.error('Error fetching employee stats:', error);
    res.status(500).send({ message: 'Server error', success: false });
  }
};

// Update order status (for admin and employee)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).send({ message: 'Order ID and status are required', success: false });
    }

    // Check if status is valid
    const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).send({ message: 'Invalid status', success: false });
    }

    // Update order status
    const updatedOrder = await orderModal.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).send({ message: 'Order not found', success: false });
    }

    res.status(200).send({
      success: true,
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).send({ message: 'Server error', success: false });
  }
};

// Delete order (for admin and employee)
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).send({ message: 'Order ID is required', success: false });
    }

    // Delete order
    const deletedOrder = await orderModal.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).send({ message: 'Order not found', success: false });
    }

    res.status(200).send({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).send({ message: 'Server error', success: false });
  }
};

// Delete employee (for admin only)
const deleteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!employeeId) {
      return res.status(400).send({ message: 'Employee ID is required', success: false });
    }

    // Delete employee
    const deletedEmployee = await modal.findByIdAndDelete(employeeId);

    if (!deletedEmployee) {
      return res.status(404).send({ message: 'Employee not found', success: false });
    }

    res.status(200).send({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).send({ message: 'Server error', success: false });
  }
};

module.exports = {
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
};
