const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalUsers = await User.countDocuments({ role: 'user' });

  const revenueResult = await Order.aggregate([
    { $match: { status: { $ne: 'Cancelled' } } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);

  const ordersByStatus = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const monthlyRevenue = await Order.aggregate([
    { $match: { status: { $ne: 'Cancelled' } } },
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 },
  ]);

  const topProducts = await Order.aggregate([
    { $unwind: '$items' },
    { $group: { _id: '$items.product', name: { $first: '$items.name' }, totalSold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);

  res.json({ totalOrders, totalProducts, totalUsers, totalRevenue, recentOrders, ordersByStatus, monthlyRevenue, topProducts });
};

module.exports = { getDashboardStats };
